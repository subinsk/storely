import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Badge,
  Tooltip,
} from '@mui/material';
import { Send, Close, Minimize, Help } from '@mui/icons-material';
import { useSocket, useSupportChatMessages } from '../hooks/useSocket';
import { useAuth } from '../contexts/AuthContext';
import { SupportChatData } from '../types/socket';
import { format } from 'date-fns';

interface Message {
  id: string;
  message: string;
  timestamp: Date;
  isFromSupport: boolean;
  sender?: {
    name: string;
    avatar?: string;
  };
}

export default function SupportChat() {
  const { user } = useAuth();
  const { socket, isConnected, joinSupportChat, emitSupportMessage } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Listen for incoming support messages
  useSupportChatMessages((data: SupportChatData) => {
    const message: Message = {
      id: `${Date.now()}-${Math.random()}`,
      message: data.message,
      timestamp: new Date(data.timestamp),
      isFromSupport: data.isFromSupport || false,
      sender: {
        name: data.isFromSupport ? 'Support Team' : user?.name || 'You',
        avatar: data.isFromSupport ? undefined : user?.image,
      },
    };

    setMessages(prev => [...prev, message]);
    
    if (!isOpen && data.isFromSupport) {
      setUnreadCount(prev => prev + 1);
    }
  });

  const handleOpenChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    
    if (user?.id && user?.organizationId) {
      joinSupportChat(user.id);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user?.id || !user?.organizationId) return;

    const messageData: SupportChatData = {
      organizationId: user.organizationId,
      userId: user.id,
      message: newMessage.trim(),
      timestamp: new Date(),
      isFromSupport: false,
    };

    emitSupportMessage(messageData);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Button
            variant="contained"
            onClick={handleOpenChat}
            startIcon={<Help />}
            sx={{
              borderRadius: '50px',
              px: 3,
              py: 1.5,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1BA3D3 90%)',
              },
            }}
          >
            Need Help?
          </Button>
        </Badge>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 350,
        height: isMinimized ? 'auto' : 500,
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
            <Help />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Customer Support
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {isConnected ? (
                <Chip
                  label="Online"
                  size="small"
                  sx={{ bgcolor: 'rgba(76,175,80,0.8)', color: 'white', height: 16 }}
                />
              ) : (
                <Chip
                  label="Connecting..."
                  size="small"
                  sx={{ bgcolor: 'rgba(255,193,7,0.8)', color: 'white', height: 16 }}
                />
              )}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row">
          <IconButton
            size="small"
            onClick={() => setIsMinimized(!isMinimized)}
            sx={{ color: 'white' }}
          >
            <Minimize />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setIsOpen(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </Stack>
      </Box>

      {!isMinimized && (
        <>
          {/* Messages */}
          <Box
            sx={{
              height: 350,
              overflowY: 'auto',
              p: 1,
              bgcolor: '#f5f5f5',
            }}
          >
            {messages.length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  👋 Welcome! How can we help you today?
                </Typography>
              </Box>
            )}

            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  mb: 1,
                  display: 'flex',
                  justifyContent: message.isFromSupport ? 'flex-start' : 'flex-end',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: message.isFromSupport ? 'white' : 'primary.main',
                    color: message.isFromSupport ? 'text.primary' : 'white',
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2">
                    {message.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      display: 'block',
                      mt: 0.5,
                    }}
                  >
                    {format(message.timestamp, 'HH:mm')}
                  </Typography>
                </Box>
              </Box>
            ))}

            {isTyping && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Support is typing...
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Input */}
          <Box sx={{ p: 2 }}>
            {!isConnected && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Connecting to support...
              </Alert>
            )}

            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                color="primary"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500',
                  },
                }}
              >
                <Send />
              </IconButton>
            </Stack>
          </Box>
        </>
      )}
    </Card>
  );
}
