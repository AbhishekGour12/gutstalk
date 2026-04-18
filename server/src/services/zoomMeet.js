import axios from 'axios';
import crypto from 'crypto';

// Zoom API credentials from environment variables
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_USER_EMAIL = process.env.ZOOM_USER_EMAIL || 'me';

const ZOOM_API_BASE_URL = 'https://api.zoom.us/v2';
const ZOOM_AUTH_TOKEN_URL = 'https://zoom.us/oauth/token';

// Helper to get a fresh access token
async function getZoomAccessToken() {
    try {
        const authHeader = `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`;
        const encodedAuth = Buffer.from(authHeader).toString('base64');

        const response = await axios.post(
            `${ZOOM_AUTH_TOKEN_URL}?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
            {},
            {
                headers: {
                    'Authorization': `Basic ${encodedAuth}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error('❌ Failed to get Zoom access token:', error.response?.data || error.message);
        throw new Error(`Zoom authentication failed: ${error.response?.data?.message || error.message}`);
    }
}

// Main function to create a Zoom meeting
export const createZoomMeetingLink = async (booking) => {
    try {
        const accessToken = await getZoomAccessToken();

        const startDateTime = `${booking.date.toISOString().split('T')[0]}T${booking.startTime}:00+05:30`;

        // Meeting configuration
        const meetingConfig = {
            topic: `Gut Health Consultation - ${booking.bookingId}`,
            type: 2, // Scheduled meeting
            start_time: startDateTime,
            timezone: 'Asia/Kolkata',
            duration: calculateDuration(booking.startTime, booking.endTime),
            agenda: `Consultation with user ${booking.userId || booking.guestEmail || 'Guest'}`,
            password: generateMeetingPassword(booking.bookingId),
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: true,
                mute_upon_entry: false,
                waiting_room: false,
                approval_type: 2, // Automatically approve all registrants
                registration_type: 1, // Register once for multiple sessions
                audio: 'both', // Both phone and computer audio
                auto_recording: 'cloud', // Auto-record to cloud
                alternative_hosts: ZOOM_USER_EMAIL !== 'me' ? ZOOM_USER_EMAIL : '',
            }
        };

        const response = await axios.post(
            `${ZOOM_API_BASE_URL}/users/${ZOOM_USER_EMAIL}/meetings`,
            meetingConfig,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const meeting = response.data;
        return meeting.join_url; // The Zoom meeting link
    } catch (error) {
        console.error('❌ Zoom meeting creation failed:', error.response?.data || error.message);
        throw new Error(`Failed to create Zoom meeting: ${error.response?.data?.message || error.message}`);
    }
};

// Helper to calculate meeting duration in minutes
function calculateDuration(startTime, endTime) {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    return duration > 0 ? duration : 60; // Default to 60 minutes if calculation is off
}

// Helper to generate a secure 6-character meeting password
function generateMeetingPassword(bookingId) {
    const hash = crypto.createHash('md5').update(bookingId).digest('hex');
    return hash.substring(0, 6).toUpperCase();
}