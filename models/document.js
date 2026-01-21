import mongoose from "mongoose";

const documentSchema = mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        enum: ['user-stories', 'models', 'views', 'routes', 'pseudocode'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        required: false,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
                ref: 'Project',
                required: true,
    },
    owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    parentDoc: {
        type: mongoose.Schema.Types.ObjectId,
                ref: 'Document',
                required: false,
    },
});

const Document = mongoose.model('Document', documentSchema);

export default Document;