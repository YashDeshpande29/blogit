const mongoose=require('mongoose')

const PostSchema=new mongoose.Schema({
    title:{
        type:String,
        required:false
    },
    desc:{
        type:String,default:' ' ,
        required:false
    },
    photo:{
        type:String,
        required:false
    },
    username:{
        type:String,
        required:false
    },
    userId:{
        type:String,
        required:false
    },
    categories:{
        type:Array,
        required:false
    }

},{timestamps:true});

module.exports=mongoose.model('Post',PostSchema);