import { Router } from 'express';
import { PostController } from './post.controller';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidation } from './post.validation';
import auth from '../../middlewares/auth';

const router: Router = Router();

// Public routes
router.get('/', PostController.getAllPosts);
router.get('/:postId', PostController.getPost);
router.get('/:postId/likes', PostController.getPostLikes);

// Protected routes (require authentication)
router.post(
  '/',
  auth(),
  validateRequest(PostValidation.createPostValidationSchema),
  PostController.createPost
);

router.patch(
  '/:postId',
  auth(),
  validateRequest(PostValidation.updatePostValidationSchema),
  PostController.updatePost
);

router.delete('/:postId', auth(), PostController.deletePost);

router.post('/:postId/like', auth(), PostController.togglePostLike);

router.get('/feed/user', auth(), PostController.getUserFeed);

export const PostModuleRoutes = router;
