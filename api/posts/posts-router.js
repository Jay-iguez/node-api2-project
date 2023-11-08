// implement your posts router here

const express = require('express')
const Data = require('./posts-model')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const fetchedPosts = await Data.find()
        res.status(200).json(fetchedPosts)
    } catch(err) {
        res.status(500).json({
            message: 'The posts information could not be retrieved '
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const fetchedPost = await Data.findById(id)
        if (!fetchedPost) {
            res.status(404).json({
                message: `The post with the specified ${id} does not exist`
            })
        } else {
            res.status(200).json(fetchedPost)
        }
    } catch(err) {
        res.status(500).json({
            message: 'The post information could not be retrieved'
        })
    }
})

module.exports = router