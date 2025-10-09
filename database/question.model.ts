import { Schema, Types, models, model, Document } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  tags?: Types.ObjectId[];
  views?: number;
  upvotes?: number;
  downvotes?: number;
  answers?: number;
  author: Types.ObjectId;
}
export interface IQuestionDoc extends IQuestion, Document {}
const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, red: "Tags" }],
    views: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, red: "User", required: true },
  },
  { timestamps: true }
);

const Question =
  models?.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
