import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// MongoDB Certificate schema
const certificateSchema = new mongoose.Schema({
  name: String,
  width: Number,
  height: Number,
  canvasData: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Certificate = mongoose.model('Certificate', certificateSchema);

// AWS S3 client
const s3 = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 🔥 S3 route - Presigned upload URL
app.get('/get-presigned-url', async (req, res) => {
  const { filename } = req.query;

  if (!filename) {
    res.status(400).json({ error: 'Filename is required' });
    return;
  }

  try {
    const command = new PutObjectCommand({
      Bucket: 'imagebucket-123',
      Key: filename as string,
      ContentType: 'image/jpeg', // you can dynamically change this if needed
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    res.json({ url });
  } catch (err) {
    console.error('❌ Error generating S3 URL:', err);
    res.status(500).json({ error: 'Could not generate pre-signed URL' });
  }
});

// 🔧 POST - Create certificate
app.post('/certificate', async (req, res) => {
  try {
    const { name, width, height, canvasData } = req.body;
    const cert = new Certificate({ name, width, height, canvasData });
    const saved = await cert.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Error creating certificate' });
  }
});
// PATCH /certificate/:id/append-object
app.patch('/certificate/:id/append-object', async (req, res) => {
  try {
    const { id } = req.params;
    const { newObject } = req.body;

    const cert = await Certificate.findById(id);
    if (!cert){
      res.status(404).json({ error: 'Certificate not found' });
      return;
    } 

    const existingObjects = cert.canvasData?.objects || [];
    const updatedObjects = [...existingObjects, newObject];

    cert.canvasData = {
      ...cert.canvasData,
      objects: updatedObjects,
    };
    cert.updatedAt = new Date();
    const saved = await cert.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to append object' });
  }
});
// PATCH /certificate/:certId/object/:objectId
app.patch('/certificate/:certId/object/:objectId', async (req, res) => {
  const { certId, objectId } = req.params;
  const updates = req.body; // like { fontSize: 30 }

  // 1. Fetch the certificate from DB
  const cert = await Certificate.findById(certId);
  if (!cert) {
    res.status(404).send("Certificate not found");
    return;
  }

  // 2. Find the object in canvasData array
  const objIndex = cert.canvasData.objects.findIndex(obj => obj.id === objectId);
  if (objIndex === -1)  {
    res.status(404).send("Object not found");
    return;
  }

  // 3. Apply updates
  cert.canvasData.objects[objIndex] = {
    ...cert.canvasData.objects[objIndex],
    ...updates
  };

  // 4. Save
  await cert.save();
  res.send({ success: true });
});


// 🔧 PUT - Update certificate
app.put('/certificate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body, updatedAt: new Date() };
    const updated = await Certificate.findByIdAndUpdate(id, update, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating certificate' });
  }
});

// 🔧 GET - Get certificate
app.get('/certificate/:id', async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    res.json(cert);
  } catch (err) {
    res.status(404).json({ error: 'Certificate not found' });
  }
});

// Server port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
