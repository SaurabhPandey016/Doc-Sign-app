import 'dotenv/config';
import prisma from './src/config/db.js';

const userId = '6e64e6e2-dd13-457c-b9df-a8865939076d';

try {
  // Create a test document
  const doc = await prisma.document.create({
    data: {
      title: 'Test Signing Document',
      fileUrl: 'https://example.com/test.pdf',
      status: 'PENDING',
      ownerId: userId
    }
  });
  
  console.log('✅ Document created:', doc.id);
  console.log('Document details:', JSON.stringify(doc, null, 2));
  
  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
