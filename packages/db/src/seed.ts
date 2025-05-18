import { client } from "./client.js";
import { posts } from "./data.js";

export async function seed() {
  // TODO: Uncomment below once you set up Prisma and loaded data to your database
  console.log("🌱 Seeding data");
  await client.db.like.deleteMany();
  await client.db.post.deleteMany();

  // Reset the auto-increment sequence for the Post table
  await client.db.$executeRawUnsafe(`DELETE
                                     FROM sqlite_sequence
                                     WHERE name = 'Post';`);

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