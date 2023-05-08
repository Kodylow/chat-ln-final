// pages/api/searchDocuments.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { Document } from 'langchain/document';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;

  console.log('Query:', query)
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  // Initialize Pinecone client
  const apiKey = process.env.PINECONE_API_KEY;
  const environment = 'us-east4-gcp'
  const indexName = 'chatln';

  if (!apiKey || !environment) {
    return res.status(500).json({ error: 'Pinecone environment variables are missing.' });
  }

  const pinecone = new PineconeClient();
  await pinecone.init({
    environment,
    apiKey,
  });

  const index = pinecone.Index(indexName);
  const embeddings = new OpenAIEmbeddings();

  try {
    const questionEmbedding = await embeddings.embedQuery(query);
    const docs = await similarityVectorSearch(questionEmbedding, 5, index);
    console.log('Documents:', docs)
    res.status(200).json({ results: docs });
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).json({ error: 'Error searching documents.' });
  }
}

export async function similarityVectorSearch(
  vectorQuery: number[],
  k = 5,
  index: ReturnType<typeof PineconeClient.prototype.Index>,
): Promise<Document[]> {
  console.log('Searching for similar documents...')
  const queryRequest = {
    vector: vectorQuery,
    topK: k,
    includeMetadata: true
  };

  console.log('Query request:', queryRequest)

  const results = await index.query({
    queryRequest
  });
  console.log('Results:', results)

  const documents: Document[] = [];

  if (results.matches) {
    for (const res of results.matches) {
      const { text: pageContent, ...metadata } = res?.metadata as Record<string, any>;
      if (res.score) {
        documents.push(new Document({ metadata, pageContent }));
      }
    }
  }

  return documents;
}
