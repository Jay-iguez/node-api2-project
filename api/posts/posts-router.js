// implement your posts router here

const express = require('express')
const Data = require('./posts-model')
const router = express.Router()

const errStatus = (res, code, message) => {
    return res.status(code).json({
        message: message
    })
}

router.get('/', async (req, res) => {
    try {
        const fetchedPosts = await Data.find()
        res.status(200).json(fetchedPosts)
    } catch (err) {
        errStatus(res, 500, 'The posts information could not be retrieved')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const fetchedPost = await Data.findById(id)
        if (!fetchedPost) {
            errStatus(res, 404, `The post with the specified ${id} does not exist`)
        } else {
            res.status(200).json(fetchedPost)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The post information could not be retrieved'
        })
    }
})

router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Data.findById(id)
        if (!post) {
            errStatus(res, 404, `The post with the specified ${id} does not exist`)
        } else {
            const postComments = await Data.findPostComments(id)
            res.status(200).json(postComments)
        }
    } catch(err) {
        errStatus(res, 500, 'The comments information could not be retrieved')
    }
})

router.post('/', async (req, res) => {
    try {
        const { title, contents } = req.body
        if (!title || !contents) {
            errStatus(res, 400, 'Please provide title and contents for the post')
        } else {
            const newPostId = await Data.insert(req.body)
            const newPost = await Data.findById(newPostId.id)
            res.status(201).json(newPost)
        }
    } catch (err) {
        errStatus(res, 500, `There was an error while saving the post to the database`)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, contents } = req.body
        const post = await Data.findById(id)
        if (!post) {
            errStatus(res, 404, `The post with the specified ${id} does not exist`)
        } else {
            if (!title || !contents) {
                errStatus(res, 400, 'Please provide title and contents for the post')
            } else {
                const updatedPostId = await Data.update(id, req.body)
                const updatedPost = await Data.findById(updatedPostId)
                res.status(200).json(updatedPost)
            }
        }
    } catch(err) {
        errStatus(res, 500, 'The post information could not be modified')
    } 
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const post = await Data.findById(id)
        if (!post) {
            errStatus(res, 404, `The post with the specified ${id} does not exist`)
        } else {
            const toBeRemoved = await Data.findById(id)
            await Data.remove(id)
            res.status(200).json(toBeRemoved)
        }
    } catch(err) {
        errStatus(res, 500, 'The post could not be removed')
    }
})

module.exports = router