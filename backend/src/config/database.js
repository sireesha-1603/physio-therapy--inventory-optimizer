const mongoose = require('mongoose')
const dns = require('node:dns')
exports.connectDatabase = () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Create backend/.env from .env.example and set your MongoDB connection string.')
  }
  if (uri.startsWith('mongodb+srv://') && process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(',').map(value => value.trim()).filter(Boolean))
  }
  return mongoose.connect(uri)
}
