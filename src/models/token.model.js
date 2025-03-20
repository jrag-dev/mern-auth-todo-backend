import { Schema, model } from 'mongoose';

const tokenSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId
    },
    token: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model('Token', tokenSchema);