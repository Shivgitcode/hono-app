import { Hono } from 'hono'
import { getPrisma } from './Config/client';
import { env } from "hono/adapter"

const app = new Hono()


app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.post("/todo", async (c) => {
  const body = await c.req.json()
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)
  const prisma = await getPrisma(DATABASE_URL)
  const { title, isDone } = body;
  const newTodo = await prisma.todo.create({
    data: {
      title,
      isDone
    }
  })

  return c.json({
    message: "todo created",
    data: newTodo
  })
})

app.get("/todo", async (c) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c)

  const prisma = await getPrisma(DATABASE_URL)
  const allTodos = await prisma.todo.findMany({})

  return c.json({
    message: "these are all todos",
    data: allTodos
  })
})

export default app
