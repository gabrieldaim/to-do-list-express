const express = require ('express');

const router = express.Router();

const Checklist = require ('..//models/checklist')



router.get('/', async (req , res) =>{
try {
    let checklists = await Checklist.find({})
    res.status(200).render('checklists/index', {checklists: checklists})
} catch (error) {
    res.status(422).render('pages/error/index', {error: 'Erro ao exibir a lista'})
}
})

router.get('/new', async (req, res) =>{
    try {
        let checklist = new Checklist();
        res.status(200).render('checklists/new', {checklist:checklist})
    } catch (error) {
        res.status(500).render('pages/error', {erros: 'Erro ao carregar o Formulário'})
    }
})

router.post('/', async (req, res) =>{
    let {name} = req.body.checklist
    let checklist = new Checklist({name})

    
    try {
        await checklist.save()
        res.redirect('/checklists')
    } catch (error) {
        res.status(422).render('checklists/new', {checklist: {...checklist,error}})
    }

})

router.get('/:id', async (req, res) =>{
try {
    let checklist = await Checklist.findById(req.params.id)
    res.status(200).render('checklists/show', {checklist: checklist})
} catch (error) {
    res.status(422).render('pages/error/index', {error: 'Erro ao exibir a lista'})
}
})

router.put('/:id', async(req,res) =>{
    let {name} = req.body
try {
    console.log({name})
    let checklist = await Checklist.findByIdAndUpdate(req.params.id, {name}, {new: true})
    res.status(200).json(checklist)
} catch (error) {
    res.status(422).json(checklist)
}
})

router.delete('/:id', async(req,res) =>{
try {
    let checklist = await Checklist.findByIdAndRemove(req.params.id)
    res.status(200).json(checklist)
} catch (error) {
    res.status(422).json(checklist)
}
})

module.exports = router;