import cron from "node-cron";
import Order from "../Models/Order.js";
import Product from "../Models/Products.js";
import { getAWBFromOrder, trackShipment } from "../services/shipRocketServices.js";

// ==============================
// RESTOCK PRODUCTS (ONCE ONLY)
// ==============================
const restockProducts = async (order) => {
  if (order.isRestocked) return;

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }

  order.isRestocked = true;
};

// ==============================
// STATUS NORMALIZER
// ==============================
const normalizeStatus = (status = "") =>
  status.trim().toUpperCase();

const CANCELED_STATUSES = [
  "CANCELED",
  "CANCELLED",
  "SHIPMENT CANCELLED",
  "PICKUP CANCELLED",
];

// ==============================
// MAIN CRON JOB
// ==============================
export const shiprocketCron = () => {
  cron.schedule("*/60 * * * *", async () => {
    console.log("⏳ Shiprocket Cron Started");

    try {
      const orders = await Order.find({
        shiprocketOrderId: { $exists: true, $ne: null },
        shiprocketStatus: { $nin: ["DELIVERED"] }
      });

      if (!orders.length) {
        console.log("ℹ No active Shiprocket orders");
        return;
      }

      for (const order of orders) {
        console.log(`📦 Checking Order: ${order.shiprocketOrderId}`);

        const shipment = await getAWBFromOrder(order.shiprocketOrderId);
        if (!shipment?.awb) continue;

        if (!order.awbCode) order.awbCode = shipment.awb;

        const trackingRes = await trackShipment(shipment.awb);
        const tracking = trackingRes?.tracking_data;
        if (!tracking) continue;

        const newStatusRaw = shipment.status;
        const newStatus = normalizeStatus(newStatusRaw);

        // 🧠 Skip if unchanged
        if (normalizeStatus(order.shiprocketStatus) === newStatus) continue;

        // ==============================
        // ❌ CANCELED → RESTOCK
        // ==============================
        if (CANCELED_STATUSES.includes(newStatus)) {
          order.shiprocketStatus = newStatus;
          order.shiprocketStatusDate = new Date();

          await restockProducts(order);
          await order.save();

          console.log(`🔁 Restocked due to ${newStatus}: ${order._id}`);
          continue;
        }

        // ==============================
        // PRE PICKUP
        // ==============================
        if (tracking.track_status === 0) {
          order.shiprocketStatus = newStatus;
          order.shiprocketStatusDate = new Date();
          await order.save();
          continue;
        }

        // ==============================
        // UPDATE TRACKING
        // ==============================
        order.shiprocketStatus = newStatus;
        order.shiprocketStatusDate = new Date();
        order.trackingHistory =
          tracking.shipment_track_activities || [];

        // ==============================
        // 🔁 RTO DELIVERED → RESTOCK
        // ==============================
        if (newStatus === "RTO DELIVERED") {
          await restockProducts(order);
          console.log(`🔁 RTO Delivered → Restocked: ${order._id}`);
        }

        await order.save();
      }

      console.log("✅ Shiprocket Cron Completed");

    } catch (err) {
      console.error("❌ Shiprocket Cron Error:", err.message);
    }
  });
};
