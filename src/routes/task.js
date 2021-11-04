const express = require ('express');
const checklist = require('../models/checklist');


const checklistDependentRouter = express.Router();
const simpleRouter = express.Router()

const Checklist = require ('../models/checklist')
const Task = require ('../models/task')


checklistDependentRouter.get('/:id/tasks/new', async (req, res) => {
    try {
        const task = new Task();
        res.status(200).render('tasks/new', { checklistId: req.params.id, task: task });
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Erro ao Criar uma tarefa' });
    }
});

simpleRouter.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        const checklist = await Checklist.findById(task.checklist)
        const taskToRemove = checklist.tasks.indexOf(task._id)
        checklist.tasks.splice(taskToRemove, 1);
        checklist.save()
        res.redirect(`/checklists/${checklist._id}`)
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Erro ao remover uma tarefa' });
    }
});

checklistDependentRouter.post('/:id/tasks', async(req, res) =>{
    let {name} = req.body.task
    let task = new Task ({name, checklist: req.params.id})
    try {
        await task.save()
        let checklist = await Checklist.findById(req.params.id)
        checklist.tasks.push(task)
        await checklist.save()
        res.redirect(`/checklists/${req.params.id}`)
    } catch (error) {
        res.status(422).render('task/new', {task: {task: {...task, errors}, checklistId: req.params.id}})
    }
})

simpleRouter.put('/:id', async (req, res) => {
    let task = await Task.findById(req.params.id);
    try {
        task.set(req.body.task)
        await task.save()
        res.status(200).json({task})
    } catch (error) {
        let erros = error.errors
        res.status(422).json({task: {...errors}})
    }
});

module.exports = { 
    checklistDependent : checklistDependentRouter,
    simple: simpleRouter
}