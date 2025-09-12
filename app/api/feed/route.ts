import { NextResponse } from 'next/server';

const getSearchTermsForInterests = (interests: string[]) => {
    const interestMap: Record<string, string[]> = {
      'tech': ['programming tutorial', 'web development', 'machine learning explained', 'coding bootcamp'],
      'learning': ['study techniques', 'learning methods', 'how to learn faster', 'memory techniques'],
      'motivation': ['motivation speech', 'success mindset', 'productivity tips', 'goal setting'],
      'cooking': ['cooking tutorial', 'healthy recipes', 'culinary techniques', 'chef tips'],
      'finance': ['personal finance', 'investing basics', 'budgeting tips', 'financial literacy'],
      'wellness': ['mental health', 'mindfulness meditation', 'stress management', 'self care'],
      'fitness': ['workout routine', 'exercise tutorial', 'fitness tips', 'health advice'],
      'career': ['career advice', 'job interview tips', 'professional development', 'leadership skills'],
      'creativity': ['design tutorial', 'creative process', 'art techniques', 'innovation methods'],
      'self-improvement': ['personal development', 'life skills', 'habit formation', 'self growth']
    };

    const searchTerms: string[] = [];
    interests.forEach(interest => {
      const terms = interestMap[interest];
      if (terms) {
        searchTerms.push(...terms);
      }
    });

    return searchTerms.length > 0 ? searchTerms : ['educational content', 'tutorial', 'how to learn'];
};

const categorizeVideo = (title: string, description: string, interests: string[]) => {
    const content = (title + ' ' + description).toLowerCase();
    
    const keywords: Record<string, string[]> = {
        'tech': ['programming', 'coding', 'software', 'development', 'computer', 'technology'],
        'learning': ['study', 'learn', 'education', 'tutorial', 'course', 'lesson'],
        'motivation': ['motivation', 'inspiration', 'success', 'mindset', 'productivity'],
        'cooking': ['cooking', 'recipe', 'chef', 'culinary', 'food', 'kitchen'],
        'finance': ['finance', 'money', 'investing', 'business', 'economics', 'budget'],
        'wellness': ['wellness', 'health', 'meditation', 'mindfulness', 'mental health'],
        'fitness': ['fitness', 'workout', 'exercise', 'training', 'gym', 'health'],
        'career': ['career', 'job', 'professional', 'leadership', 'work', 'business'],
        'creativity': ['design', 'art', 'creative', 'drawing', 'innovation', 'artistic'],
        'self-improvement': ['improvement', 'development', 'growth', 'habits', 'skills']
    };
    
    for (const interest of interests) {
      const interestKeywords = keywords[interest];
      if (interestKeywords && interestKeywords.some(keyword => content.includes(keyword))) {
        return interest;
      }
    }
    
    return 'learning'; // default category
};


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const interestsParam = searchParams.get('interests');
  const pageToken = searchParams.get('pageToken') || '';

  if (!interestsParam) {
    return NextResponse.json({ error: 'Interests are required' }, { status: 400 });
  }

  const interests = interestsParam.split(',');

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  if (!YOUTUBE_API_KEY) {
    console.error('YOUTUBE_API_KEY is not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: YouTube API key is missing.' }, { status: 500 });
  }

  try {
    const searchTerms = getSearchTermsForInterests(interests);
    const randomSearchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

    // 1. Search for videos
    const searchApiUrl = new URL(`${YOUTUBE_API_BASE_URL}/search`);
    searchApiUrl.searchParams.set('part', 'snippet');
    searchApiUrl.searchParams.set('q', `${randomSearchTerm} tutorial educational`);
    searchApiUrl.searchParams.set('type', 'video');
    searchApiUrl.searchParams.set('videoDuration', 'medium');
    searchApiUrl.searchParams.set('videoDefinition', 'high');
    searchApiUrl.searchParams.set('maxResults', '10');
    searchApiUrl.searchParams.set('pageToken', pageToken);
    searchApiUrl.searchParams.set('key', YOUTUBE_API_KEY);

    const searchResponse = await fetch(searchApiUrl.toString());
    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error('YouTube Search API Error:', errorData);
      return NextResponse.json({ error: errorData.error?.message || 'Failed to search videos' }, { status: searchResponse.status });
    }
    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return NextResponse.json({ videos: [], nextPageToken: '' });
    }

    // 2. Get video details
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    const detailsApiUrl = new URL(`${YOUTUBE_API_BASE_URL}/videos`);
    detailsApiUrl.searchParams.set('part', 'snippet,statistics,contentDetails');
    detailsApiUrl.searchParams.set('id', videoIds);
    detailsApiUrl.searchParams.set('key', YOUTUBE_API_KEY);

    const detailsResponse = await fetch(detailsApiUrl.toString());
    if (!detailsResponse.ok) {
        const errorData = await detailsResponse.json();
        console.error('YouTube Videos API Error:', errorData);
        return NextResponse.json({ error: errorData.error?.message || 'Failed to fetch video details' }, { status: detailsResponse.status });
    }
    const detailsData = await detailsResponse.json();

    // 3. Combine and categorize
    const videos = detailsData.items.map((video: any) => ({
      ...video,
      category: categorizeVideo(video.snippet.title, video.snippet.description, interests)
    }));

    return NextResponse.json({
      videos: videos,
      nextPageToken: searchData.nextPageToken || '',
    });

  } catch (error) {
    console.error('Error in /api/feed:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}