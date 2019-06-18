const fs = require('fs')

const { ApolloServer, gql } = require('apollo-server-micro')
const matter = require('gray-matter')
const rra = require('recursive-readdir-async')

const typeDefs = gql`
	scalar DateTime

	type Post {
		title: String!
		author: String!
		content: String!
		date: DateTime
		permalink: String
		slug: String!
	}

	type Page {
		title: String!
		permalink: String
		content: String
		slug: String
	}

	type Query {
		posts: [Post]
		post(name: String): Post
		pages: [Page]
		page(name: String): Page
	}
`

async function getPosts() {
	let allPosts = []
	await rra.list(`${__dirname}/posts`, {
		include: [ '.md' ],
		readContent: true,
		encoding: 'utf8'
	}, (post) => {
		const parsedPost = matter(post.data)
		delete parsedPost.isEmpty
		delete parsedPost.excerpt

		allPosts.push({
			...parsedPost.data,
			...parsedPost
		})
	})

	return allPosts
}

async function getPost(name) {
	try {
		const file = fs.readFileSync(`${__dirname}/posts/${name}.md`)
		const parsedPost = matter(file)
		delete parsedPost.isEmpty
		delete parsedPost.excerpt

		return {
			...parsedPost.data,
			...parsedPost
		}
	} catch (e) {
		throw new Error(`Couldn't find post ${name}.md`)
	}
}

async function getPages() {
	let allPages = []
	await rra.list(`${__dirname}/pages`, {
		include: [ '.md' ],
		readContent: true,
		encoding: 'utf8'
	}, (page) => {
		const parsedPages = matter(page.data)
		delete parsedPages.isEmpty
		delete parsedPages.excerpt

		allPages.push({
			...parsedPages.data,
			...parsedPages
		})
	})

	return allPages
}

const resolvers = {
	Query: {
		async posts(parent, args, context) {
			return await getPosts()
		},

		async post(parent, args, context) {
			return await getPost(args.name)
		},

		async pages(parent, args, context) {
			return await getPages()
		},

		async page(parent, args, context) {
			return await getPages(args.name)
		}
	}
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })
module.exports = apolloServer.createHandler()
