import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { CommentController } from './comment.controller';
import { CommentValidation } from './comment.validation';

const router: Router = Router();

// Public routes
router.get('/:commentId', CommentController.getComment);
router.get('/:commentId/replies', CommentController.getCommentReplies);
router.get('/:commentId/likes', CommentController.getCommentLikes);
// Get all comments on a post (top-level only)
router.get("/post/:postId",CommentController.getPostComments)
// Protected routes (require authentication)
router.post(
  '/post/:postId',
  auth(),
  validateRequest(CommentValidation.createCommentValidationSchema),
  CommentController.createComment
);

router.patch(
  '/:commentId',
  auth(),
  validateRequest(CommentValidation.updateCommentValidationSchema),
  CommentController.updateComment
);

router.delete('/:commentId', auth(), CommentController.deleteComment);

router.post('/:commentId/like', auth(), CommentController.toggleCommentLike);

export const CommentModuleRoutes = router;
