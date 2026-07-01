const { google } = require('googleapis');
const stream = require('stream');
const path = require('path');
const fs = require('fs');

const KEY_FILE_PATH = path.join(__dirname, '../serviceAccountKey.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function uploadFileToDrive(fileObject) {
    try {
        // Check if key file exists
        if (!fs.existsSync(KEY_FILE_PATH)) {
            console.warn('Google Drive Service Account Key not found. Skipping Drive upload.');
            return { id: null, webViewLink: null };
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE_PATH,
            scopes: SCOPES,
        });

        const drive = google.drive({ version: 'v3', auth });

        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileObject.buffer);

        const media = {
            mimeType: fileObject.mimetype,
            body: bufferStream,
        };

        const fileMetadata = {
            name: `Valentine_${Date.now()}_${fileObject.originalname}`,
            parents: [] // Optional: Add a specific Folder ID here if needed
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink, webContentLink',
        });

        // Make the file publicly readable so it can be viewed in the app
        // Note: This makes it accessible to anyone with the link.
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        return response.data;

    } catch (error) {
        console.error('Error uploading to Google Drive (continuing without image):', error.message);
        // Return null instead of throwing to allow creation without image
        return { id: null, webViewLink: null };
    }
}

module.exports = { uploadFileToDrive };
