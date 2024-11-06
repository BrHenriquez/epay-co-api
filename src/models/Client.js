import mongoose from 'mongoose';

const sessionTokenSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, { _id: false }); // Disable _id for subdocuments

const balanceHistory = new mongoose.Schema({
  amount: { type: Number, default: 0, min: 0 },
  date: { type: Date, required: true },
  balance: { type: Number, default: 0, min: 0 },
  type: { type: String, required: true }
}, { _id: true });

const clientSchema = new mongoose.Schema({
  document: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: /.+\@.+\..+/ },
  phone: { type: String, required: true, trim: true, match: /^[0-9]{10,15}$/ },
  balance: { type: Number, default: 0, min: 0 },
  sessionTokens: [sessionTokenSchema],
  balanceHistory: [balanceHistory]
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

clientSchema.methods = {
  addSessionToken(sessionToken) {
    this.sessionTokens.push(sessionToken);
    return this.save();
  },
  clearExpiredTokens() {
    this.sessionTokens = this.sessionTokens.filter(token => token.expiresAt > new Date());
    return this.save();
  }
};

clientSchema.statics = {
  async findByDocumentAndPhone(document, phone) {
    return this.findOne({ document, phone });
  }
};

export default mongoose.model('Client', clientSchema);
