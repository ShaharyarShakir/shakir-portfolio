import { getPost } from '$lib/utils/blog';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const post = getPost(params.slug);
	if (!post) {
		error(404, 'Post not found');
	}
	return { post };
};
