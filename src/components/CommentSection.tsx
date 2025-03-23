
import React, { useState } from 'react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";

interface CommentSectionProps {
  comments: Comment[];
  productId: string;
  onAddComment: (productId: string, comment: string) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  productId,
  onAddComment 
}) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !isAuthenticated || !user) return;
    
    setIsSubmitting(true);
    
    try {
      await onAddComment(productId, newComment);
      setNewComment('');
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully."
      });
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">Comments ({comments.length})</h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <img 
              src={user?.avatar} 
              alt={user?.name} 
              className="w-9 h-9 rounded-full shrink-0"
            />
            <div className="flex-1">
              <Textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-tradehub-primary focus:border-transparent"
                placeholder="Add a comment..."
                rows={2}
                disabled={isSubmitting}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!newComment.trim() || isSubmitting}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <p className="mb-6 text-sm text-gray-600">Please log in to leave a comment.</p>
      )}
      
      {comments.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img 
                src={comment.userAvatar} 
                alt={comment.userName} 
                className="w-8 h-8 rounded-full shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{comment.userName}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
