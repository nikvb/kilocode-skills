import { error } from '@sveltejs/kit';
import { posts, postBySlug } from '$lib/data/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const post = postBySlug(params.slug);
  if (!post) {
    throw error(404, 'Post not found');
  }
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  return { post, others };
};
