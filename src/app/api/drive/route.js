// Import Firebase Admin SDK
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import fetch from "node-fetch";

// Initialize Firebase Admin with default credentials
// You might want to initialize this once in your project, not in every request
initializeApp({
  credential: applicationDefault(), // Or use service account key if not on Google Cloud
  storageBucket: "uploadtask-c6afb.appspot.com", // Your storage bucket name
});

export async function GET(req) {
  const storage = getStorage(); // Initialize Firebase Storage
  const bucket = storage.bucket(); // Get default bucket
  const fileUrl = 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID';

  // Handle CORS headers
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  try {
    // Fetch the file from Google Drive
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Failed to fetch the file');

    const buffer = await response.buffer();
    const fileName = 'your-file-name.jpg';
    const file = bucket.file(`uploads/${fileName}`);

    // Upload the file to Firebase Storage
    await file.save(buffer, { resumable: false });

    // Get the public URL
    const downloadURL = `https://storage.googleapis.com/${bucket.name}/uploads/${fileName}`;

    // Send the URL back to the client
    return new Response(JSON.stringify({ url: downloadURL }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process your request' }), { status: 500, headers });
  }
}