"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Comment {
  id: string
  content: string
  createdAt: string
  persona: {
    id: string
    name: string
    username: string
    avatarUrl: string | null
  }
}

interface Post {
  id: string
  content: string
  createdAt: string
  engagementStats: {
    likes: number
    comments: number
    shares: number
  }
  persona: {
    id: string
    name: string
    username: string
    avatarUrl: string | null
  }
  comments?: Comment[]
}

export default function FeedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generatingComments, setGeneratingComments] = useState<string | null>(null)
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())
  
  // User post creation state
  const [newPostContent, setNewPostContent] = useState("")
  const [creatingPost, setCreatingPost] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      loadPosts()
    }
  }, [status])

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Failed to load posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const generatePost = async () => {
    setGenerating(true)
    try {
      const response = await fetch("/api/posts/generate", {
        method: "POST"
      })
      const data = await response.json()
      
      if (data.post) {
        // Add new post to the top of the feed
        setPosts([data.post, ...posts])
      }
    } catch (error) {
      console.error("Failed to generate post:", error)
    } finally {
      setGenerating(false)
    }
  }

  const createUserPost = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPostContent.trim() || creatingPost) return

    setCreatingPost(true)
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPostContent })
      })

      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
        return
      }

      if (data.post) {
        // Add new post to the top of the feed
        setPosts([data.post, ...posts])
        setNewPostContent("") // Clear the input
      }
    } catch (error) {
      console.error("Failed to create post:", error)
      alert("Failed to create post. Please try again.")
    } finally {
      setCreatingPost(false)
    }
  }

  const loadComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      const data = await response.json()
      
      // Update the post with comments
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: data.comments || [] }
          : post
      ))
      
      // Expand the post to show comments
      setExpandedPosts(new Set([...expandedPosts, postId]))
    } catch (error) {
      console.error("Failed to load comments:", error)
    }
  }

  const generateComments = async (postId: string) => {
    setGeneratingComments(postId)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST"
      })
      const data = await response.json()
      
      if (data.comments) {
        // Update the post with new comments
        setPosts(posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                comments: [...(post.comments || []), ...data.comments],
                engagementStats: {
                  ...post.engagementStats,
                  comments: (post.comments?.length || 0) + data.comments.length
                }
              }
            : post
        ))
        
        // Expand the post to show comments
        setExpandedPosts(new Set([...expandedPosts, postId]))
      }
    } catch (error) {
      console.error("Failed to generate comments:", error)
    } finally {
      setGeneratingComments(null)
    }
  }

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
      // Load comments if not already loaded
      const post = posts.find(p => p.id === postId)
      if (!post?.comments) {
        loadComments(postId)
      }
    }
    setExpandedPosts(newExpanded)
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feed...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const charCount = newPostContent.length
  const maxChars = 500
  const isOverLimit = charCount > maxChars

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">NewSity Feed</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={generatePost}
              disabled={generating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {generating ? "Generating..." : "Generate AI Post"}
            </button>
            <button
              onClick={() => router.push("/messages")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
            >
              Messages
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post Box */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What's on your mind?</h2>
          <form onSubmit={createUserPost}>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your thoughts..."
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                isOverLimit ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
              disabled={creatingPost}
            />
            <div className="flex items-center justify-between mt-3">
              <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount}/{maxChars} characters
              </span>
              <button
                type="submit"
                disabled={!newPostContent.trim() || creatingPost || isOverLimit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {creatingPost ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h2>
            <p className="text-gray-600 mb-6">Create your first post or generate an AI post!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow">
                {/* Post Content */}
                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {post.persona.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{post.persona.name}</h3>
                      <p className="text-sm text-gray-500">@{post.persona.username}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-500 pt-4 border-t">
                    <span>❤️ {post.engagementStats.likes} likes</span>
                    <button 
                      onClick={() => toggleComments(post.id)}
                      className="hover:text-gray-700"
                    >
                      💬 {post.comments?.length || post.engagementStats.comments} comments
                    </button>
                    <span>🔄 {post.engagementStats.shares} shares</span>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedPosts.has(post.id) && (
                  <div className="border-t bg-gray-50">
                    {/* Generate Comments Button */}
                    <div className="px-6 py-3 border-b bg-white">
                      <button
                        onClick={() => generateComments(post.id)}
                        disabled={generatingComments === post.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                      >
                        {generatingComments === post.id ? "Generating..." : "✨ Generate Comments"}
                      </button>
                      <span className="ml-3 text-xs text-gray-500">
                        (~$0.0006 for 2-3 comments)
                      </span>
                    </div>

                    {/* Comments List */}
                    <div className="px-6 py-4 space-y-4">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {comment.persona.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                                <p className="font-semibold text-sm text-gray-900">{comment.persona.name}</p>
                                <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                              </div>
                              <p className="text-xs text-gray-400 mt-1 ml-4">
                                {new Date(comment.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No comments yet. Generate some!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
