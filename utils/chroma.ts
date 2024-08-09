import { ChromaClient } from 'chromadb';

const chroma_url = process.env.CHROMA_URL
// Initialize ChromaDB client
const client = new ChromaClient({ path: chroma_url });

// Save files to ChromaDB
export async function saveFilesToChromaDB() {
  try {
    const collection = await client.createCollection({ name: 'file_collection' });

    const files = [
      { path: 'public/uploads/activities.txt', type: 'txt' },
      // Add more files as needed
    ];

    for (const file of files) {
      const filePath = `./${file.path}`; // Construct the file path directly
      const fileContent = await readFileContent(filePath); // Read file content

      await collection.add({
        documents: [fileContent],
        metadatas: [{ type: file.type }],
        ids: [getFileName(file.path)] // Extract the file name
      });
    }
  } catch (error) {
    console.error('Error in saveFilesToChromaDB:', error);
    throw error;
  }
}

// Helper function to read file content
async function readFileContent(filePath: string): Promise<string> {
  try {
    const response = await fetch(filePath); // Fetch the file content
    if (!response.ok) {
      throw new Error(`Error fetching file: ${response.statusText}`);
    }

    const contentBuffer = await response.arrayBuffer();
    return Buffer.from(contentBuffer).toString('base64'); // Convert to base64
  } catch (error) {
    console.error('Error reading file content:', error);
    throw error;
  }
}

// Helper function to extract the file name
function getFileName(filePath: string): string {
  return filePath.split('/').pop() || ''; 
}

// Query ChromaDB
export async function queryChromaDB(query: string, nResults: number) {
  const collection = await client.getCollection({ name: 'file_collection' });

  const results = await collection.query({
    queryTexts: [query],
    nResults,
  });

  return results;
}
