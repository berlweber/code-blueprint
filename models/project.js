import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Project = mongoose.model('Project', projectSchema);

export default Project;