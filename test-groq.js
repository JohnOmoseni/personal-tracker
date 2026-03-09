const { createClient } = require('@sanity/client')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'y692h5eb', // Using some dummy or if I can find it in env
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01'
})
client.fetch('*[_type == "transaction" && clerkUserId == $clerkUserId]', { clerkUserId: 'user_3AhtjCNfyp4DC0QD0pUjdNQGOuS' }).then(console.log).catch(console.error)
