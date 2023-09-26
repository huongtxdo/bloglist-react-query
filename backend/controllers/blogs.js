const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  blog
    ? response.json(blog)
    : response.status(404).json({ error: 'blogNotFound' }).end()
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'unauthorized' }).end()
  }

  const body = request.body
  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'missingTitleOrUrl' }).end()
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  // The following is for changing in backend, we are doing changes in frontend in App.js
  // await savedBlog.populate('user', {
  //   username: 1,
  //   name: 1,
  //   id: 1,
  // })
  await savedBlog.populate('user', 'username name id')
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'unauthorizedNoToken' }).end()
  }
  const user = await User.findById(decodedToken.id)

  const blog = await Blog.findById(request.params.id)
  if (!blog)
    return response.status(401).json({ error: 'nonExistantBlog' }).end()
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'unauthorizedNotOwner' }).end()
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.delete('/', async (request, response) => {
  await Blog.deleteMany({})
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body
  if (!blog)
    response.status(404).json({ error: 'missingUpdatedBlogObject' }).end()

  const blogId = request.params.id
  if (!blogId) response.status(401).json({ error: 'missingBlogId' }).end()

  const returnedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { ...blog, user: blog.user.id },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )

  if (!returnedBlog) response.status(404).json({ error: `unableToLike` }).end()

  await returnedBlog.populate('user', 'username name id')
  response.json(returnedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const blogId = request.params.id
  if (!blogId) response.status(401).json({ error: 'missingBlogId' }).end()

  const body = request.body

  if (!body.comment)
    response.status(400).json({ error: `missingComment` }).end()

  const blog = await Blog.findById(blogId)
  if (!blog)
    return response.status(401).json({ error: 'nonExistentBlog' }).end()

  // using $set allows updating specific fiels without replacing the entire document

  const commentedBlog = {
    $set: { comments: blog.comments.concat(body.comment) },
  }

  const returnedBlog = await Blog.findByIdAndUpdate(blogId, commentedBlog, {
    new: true,
    runValidators: true,
    context: 'query',
  })

  response.status(201).json(returnedBlog)
})

module.exports = blogsRouter

