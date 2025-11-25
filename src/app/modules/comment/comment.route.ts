import { Router } from 'express';
import { CommentController } from './comment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CommentValidation } from './comment.validation';
import auth from '../../middlewares/auth';

const router: Router = Router();

// Public routes
router.get('/:commentId', CommentController.getComment);
router.get('/:commentId/replies', CommentController.getCommentReplies);
router.get('/:commentId/likes', CommentController.getCommentLikes);

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
