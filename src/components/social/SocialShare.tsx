'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    slug: string;
  };
  className?: string;
}

export function SocialShare({ product, className }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (type: string) => {
    try {
      const response = await fetch(`/api/social/share?productId=${product.id}&type=${type}`);
      const data = await response.json();

      if (response.ok) {
        if (type === 'email') {
          window.location.href = data.shareUrl;
        } else {
          window.open(data.shareUrl, '_blank', 'width=600,height=400');
        }
      } else {
        toast.error('Error al generar enlace de compartido');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const copyProductLink = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const productUrl = `${baseUrl}/product/${product.slug}`;
    
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar enlace');
    }
  };

  const shareOptions = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-50 hover:text-blue-600',
      bgColor: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-sky-50 hover:text-sky-600',
      bgColor: 'bg-sky-100 text-sky-600'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-50 hover:text-green-600',
      bgColor: 'bg-green-100 text-green-600'
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-gray-50 hover:text-gray-600',
      bgColor: 'bg-gray-100 text-gray-600'
    }
  ];

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4" />
          <span className="font-medium">Compartir producto</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.id}
                variant="outline"
                size="sm"
                onClick={() => handleShare(option.id)}
                className={`${option.color} justify-start gap-2`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{option.name}</span>
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyProductLink}
          className="w-full justify-start gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Enlace copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar enlace</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

interface QuickShareProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    slug: string;
  };
}

export function QuickShare({ product }: QuickShareProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async (type: string) => {
    try {
      const response = await fetch(`/api/social/share?productId=${product.id}&type=${type}`);
      const data = await response.json();

      if (response.ok) {
        if (type === 'email') {
          window.location.href = data.shareUrl;
        } else {
          window.open(data.shareUrl, '_blank', 'width=600,height=400');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const copyLink = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const productUrl = `${baseUrl}/product/${product.slug}`;
    
    try {
      await navigator.clipboard.writeText(productUrl);
      toast.success('Enlace copiado');
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-2"
      >
        <Share2 className="w-4 h-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-50 min-w-[200px]">
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('facebook')}
              className="justify-start gap-1 h-8 px-2 text-xs"
            >
              <Facebook className="w-3 h-3" />
              Facebook
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="justify-start gap-1 h-8 px-2 text-xs"
            >
              <Twitter className="w-3 h-3" />
              Twitter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('whatsapp')}
              className="justify-start gap-1 h-8 px-2 text-xs"
            >
              <MessageCircle className="w-3 h-3" />
              WhatsApp
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare('email')}
              className="justify-start gap-1 h-8 px-2 text-xs"
            >
              <Mail className="w-3 h-3" />
              Email
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyLink}
              className="justify-start gap-1 h-8 px-2 text-xs col-span-2"
            >
              <Copy className="w-3 h-3" />
              Copiar enlace
            </Button>
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}