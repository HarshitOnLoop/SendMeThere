export const getPlatformInfo = (url) => {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.replace('www.', '');

    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return {
        id: 'youtube',
        name: 'YouTube',
        color: '#FF0000',
        icon: 'Youtube',
        extractPath: () => {
          if (domain.includes('youtu.be')) return parsedUrl.pathname.substring(1);
          return parsedUrl.pathname + parsedUrl.search;
        },
        androidPackage: 'com.google.android.youtube',
        iosScheme: 'youtube://'
      };
    }
    
    if (domain.includes('instagram.com')) {
      return {
        id: 'instagram',
        name: 'Instagram',
        color: '#E1306C',
        icon: 'Instagram',
        extractPath: () => parsedUrl.pathname + parsedUrl.search,
        androidPackage: 'com.instagram.android',
        iosScheme: 'instagram://'
      };
    }

    if (domain.includes('twitter.com') || domain.includes('x.com')) {
      return {
        id: 'twitter',
        name: 'X (Twitter)',
        color: '#000000',
        icon: 'Twitter',
        extractPath: () => parsedUrl.pathname + parsedUrl.search,
        androidPackage: 'com.twitter.android',
        iosScheme: 'twitter://'
      };
    }

    if (domain.includes('spotify.com')) {
      return {
        id: 'spotify',
        name: 'Spotify',
        color: '#1DB954',
        icon: 'Music',
        extractPath: () => {
          const path = parsedUrl.pathname.substring(1); 
          return path.replace(/\//g, ':');
        },
        androidPackage: 'com.spotify.music',
        iosScheme: 'spotify://'
      };
    }

    if (domain.includes('linkedin.com')) {
       return {
        id: 'linkedin',
        name: 'LinkedIn',
        color: '#0077b5',
        icon: 'Linkedin',
        extractPath: () => parsedUrl.pathname + parsedUrl.search,
        androidPackage: 'com.linkedin.android',
        iosScheme: 'linkedin://'
      };
    }
    
    if (domain.includes('facebook.com') || domain.includes('fb.watch')) {
       return {
        id: 'facebook',
        name: 'Facebook',
        color: '#1877F2',
        icon: 'Facebook',
        extractPath: () => parsedUrl.pathname + parsedUrl.search,
        androidPackage: 'com.facebook.katana',
        iosScheme: 'fb://'
      };
    }

  } catch (error) {
    return null;
  }
  return null;
};

export const generateAppLinks = (originalUrl, os) => {
  const platform = getPlatformInfo(originalUrl);
  
  if (!platform) {
     return { webUrl: originalUrl };
  }

  const path = platform.extractPath();

  if (os === 'android') {
    try {
      const urlObj = new URL(originalUrl);
      const host = urlObj.host;
      const pathname = urlObj.pathname + urlObj.search;
      
      let intentUrl = `intent://${host}${pathname}#Intent;package=${platform.androidPackage};scheme=https;end;`;
      
      if (platform.id === 'spotify') {
         intentUrl = `intent://${path}#Intent;package=${platform.androidPackage};scheme=spotify;end;`;
      }
      return {
        appUrl: intentUrl,
        webUrl: originalUrl,
        platform
      };
    } catch(e) {
      return { webUrl: originalUrl, platform };
    }
  }

  if (os === 'ios') {
    let appUrl = `${platform.iosScheme}${path}`;
    
    if (platform.id === 'youtube') {
      const isShort = originalUrl.includes('youtu.be');
      appUrl = isShort ? `youtube://${path}` : `youtube://watch${path.replace('/watch', '')}`; // ensure format works loosely
    }
    
    return {
      appUrl: appUrl,
      webUrl: originalUrl,
      platform
    };
  }

  return { webUrl: originalUrl, platform };
}

export const detectOS = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) {
    return "android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  }
  return "desktop";
};

// using base64 for encoding/decoding urls in params
export const encodeUrl = (url) => {
  return btoa(url);
};

export const decodeUrl = (encoded) => {
  try {
    return atob(encoded);
  } catch(e) {
    return null;
  }
};
