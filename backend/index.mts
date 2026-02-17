import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path'
import { fileURLToPath } from "url";



const app = express();
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

console.log("MONGO:", process.env.MONGO_URI ? "loaded" : "missing");

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const certificateSchema = new mongoose.Schema({
  name: String,
  width: Number,
  height: Number,
  canvasData: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


const Certificate = mongoose.model('Certificate', certificateSchema);

const s3 = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


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
      ContentType: 'image/jpeg', 
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    res.json({ url });
  } catch (err) {
    console.error('Error generating S3 URL:', err);
    res.status(500).json({ error: 'Could not generate pre-signed URL' });
  }
});



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

app.post('/certificate/:id/elements', async (req, res) => {
  try {
    const { id } = req.params;
    const newElement = req.body;

    const certificate = await Certificate.findById(id);
    if (!certificate) {
       res.status(404).json({ error: 'Certificate not found' });
       return;
    }

    if (!certificate.canvasData || !Array.isArray(certificate.canvasData.objects)) {
      certificate.canvasData = { objects: [newElement] };
    } else {
      certificate.canvasData.objects.push(newElement);
    }

    certificate.markModified('canvasData');
    certificate.updatedAt = new Date();
    await certificate.save();

    res.status(200).json({ message: 'Element added successfully', canvasData: certificate.canvasData });
  } catch (err) {
    console.error('Failed to update canvasData:', err);
    res.status(500).json({ error: 'Failed to add element to certificate' });
  }
});



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


app.get('/certificate/:id', async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    res.json(cert);
  } catch (err) {
    res.status(404).json({ error: 'Certificate not found' });
  }
});


// ===== SERVE FRONTEND (VITE BUILD) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dist folder after vite build
const distPath = path.join(__dirname, "../dist");

app.use(express.static(distPath));

app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
