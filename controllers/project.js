'use strict'

var Project = require('../models/project');
var fs = require('fs');
var path = require('path');
var controller = {

    home: function (req, res) {
        return res.status(200).send({
            message: 'soy Home'
        });
    },

    test: function (req, res) {
        return res.status(200).send({
            message: 'Soy el método o acción test del controlador del project'
        });
    },

    saveProject: function (req, res) {
        var project = new Project();

        var params = req.body;
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;


        /*project.save((err, projectStored) => {
            if (err) return res.status(500).send({ message: 'error al guardar el documento' });

            if (!projectStored) return res.status(404).send({ message: 'No se ha podido guardar el proyecto' });

            return res.status(200).send({ project: projectStored });

        });*/

        project.save().then(projectStored => {
            if (!projectStored) return res.status(404).send({ message: 'No se ha podido guardar el proyecto' });

            return res.status(200).send({ project: projectStored });
        }).catch(err => { return res.status(500).send({ err: err }) });

        /*return res.status(200).send(
            {
                params: project,
                message: "metodo saveProject"
            }
        );*/
    },
    
    getProject: function (req, res) {
        var projectId = req.params.id;

        if (projectId == null) return res.status(404).send({ message: 'el proyecto no existe' });

        Project.findById(projectId).then(project => {
            if (!project) return res.status(404).send({ message: 'el proyecto no existe' });
            return res.status(200).send({
                project: project
            });
        }).catch(err => { return res.status(500).send({ error: err.name }); });

        /* Project.findById(projectId, (err, project) => {
 
             if (err) return res.status(500).send({ message: 'error al devolver los datos' });
             if (!project) return res.status(404).send({ message: 'el proyecto no existe' });
             return res.status(200).send({
                 project: project
             });
 
         });*/
    },

    getProjects: function (req, res) {

        Project.find().sort('-year').exec().then(
            projects => {
                if (!projects) return res.status(404).send({ message: 'No hay projectos que mostrar' });

                return res.status(200).send({ projects });
            }
        ).catch(err => {
            return res.status(500).send({ message: 'Error al devolver los datos' });
        });
        /*Project.find().sort('-year').exec((err, projects)=>{
            if(err) return res.status(500).send({message: 'Error al devolver los datos'});

            if(!projects) return res.status(404).send({message: 'No hay projectos que mostrar'});

            return res.status(200).send({projects});
        });*/
    },

    updateProject: function (req, res) {
        var projectId = req.params.id;
        var update = req.body;

        Project.findByIdAndUpdate(projectId, update, { new: true }).then(
            projectUpdated => {
                if (!projectUpdated) return res.status(404).send({ message: 'No se pudo actualizar el proyecto' });

                return res.status(200).send({ project: projectUpdated });
            }
        ).catch(err => {
            return res.status(500).send({ message: 'Error al actualizar' });
        });

        /*Project.findByIdAndUpdate(projectId, update, {new: true},(err, projectUpdated)=>{
            if(err) return res.status(500).send({message: 'Error al actualizar'});
            if(!projectUpdated) return res.status(404).send({message: 'No se pudo actualizar el proyecto'});
            
            return res.status(200).send({project: projectUpdated}); 
        });*/
    },

    deleteProject: function (req, res) {
        var projectId = req.params.id;
        Project.findByIdAndDelete(projectId).then(
            projectRemoved => {
                if (!projectRemoved) return res.status(404).send({ message: 'no se pudo borrar el proyecto' });

                return res.status(200).send({ project: projectRemoved });
            }
        ).catch(
            err => {
                return res.status(500).send({ message: 'error al borrar el proyecto' });
            }
        );
        /*Project.findByIdAndDelete(projectId, (err, projectRemoved) =>{
            if(err) return res.status(500).send({message: 'error al borrar el proyecto'});
            if(!projectRemoved) return res.status(404).send({message: 'no se pudo borrar el proyecto'});  
            
            return res.status(200).send({project: projectRemoved});
        });*/
    },

    uploadImage:function(req, res){
        var projectId = req.params.id;
        var fileName = 'Imagen no subida';
        if (req.files) {
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1].toUpperCase();
            console.log('la extensión es: '+ fileExt);
           if (fileExt == 'PNG' || fileExt == 'JPG' || fileExt == 'JPEG' || fileExt == 'GIF') {
            Project.findByIdAndUpdate(projectId, {image: fileName}, {new: true}, (err, projectUpdated)=>{
                if(err) return res.status(500).send({message: 'La imagen no se ha subido'});
                if(!projectUpdated) return res.status(404).send({message: 'El proyecto no existe'});

                return res.status(200).send({
                    files:projectUpdated
                });
            });
           } else{
            fs.unlink(filePath,(err)=>{
                return res.status(200).send({message: 'La extensión no es valida'});
            });
           }     
        }else{
            return res.status(200).send({
                message: fileName
            });
        }
    },
    getImageFile: function(req, res){
        var file = req.params.image;
        var path_file = './uploads/'+file;
        console.log(path_file);

        fs.exists(path_file, (exists)=>{
            if(exists){
                console.log('exists');
                return res.sendFile(path.resolve(path_file));
            }else{
                console.log('error');
                return res.status(200).send({
                    message: 'No existe la imagen...'
                });
            }
        });
    }

};

module.exports = controller;