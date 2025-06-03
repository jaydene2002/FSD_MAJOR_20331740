import { client } from "./client.js";
import { posts, morePosts } from "./data.js";

export async function seed() {
  // TODO: Uncomment below once you set up Prisma and loaded data to your database
  console.log("🌱 Seeding data");
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();

 try {
  // PostgreSQL approach
  await client.db.$executeRaw`ALTER SEQUENCE "Post_id_seq" RESTART WITH 1;`;
} catch (e) {
  try {
    // SQLite approach
    await client.db.$executeRawUnsafe(`DELETE FROM sqlite_sequence WHERE name = 'Post';`);
  } catch (sqliteError) {
    console.log("Warning: Could not reset sequence, continuing with seed anyway...");
  }
}
  
  for (const post of posts) {
    const createdPost = await client.db.post.create({
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        description: post.description,
        imageUrl: post.imageUrl,
        tags: post.tags
          .split(",")
          .map((p) => p.trim())
          .join(","),
        urlId: post.urlId,
        active: post.active,
        date: post.date,
        views: post.views,
        likes: post.likes,
      },
    });

    for (let i = 0; i < post.likes; i++) {
      await client.db.like.create({
        data: {
          postId: createdPost.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }

    // Update the likes count in the Post table
    await client.db.post.update({
      where: { id: createdPost.id },
      data: { likes: post.likes },
    });
  }
}

export async function seedMore() {
  console.log("🌱 Seeding more data");
  for (const post of morePosts) {
    await client.db.post.create({
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        description: post.description,
        imageUrl: post.imageUrl,
        tags: post.tags
          .split(",")
          .map((p) => p.trim())
          .join(","),
        urlId: post.urlId,
        active: post.active,
        date: post.date,
        views: post.views,
        likes: post.likes,
      },
    });
  }
}
