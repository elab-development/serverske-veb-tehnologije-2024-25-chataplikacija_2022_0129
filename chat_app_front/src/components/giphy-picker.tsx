import { useState, useEffect } from 'react';
import { giphyService, type GiphyGif } from '../services/giphy-service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, TrendingUp, Loader2 } from 'lucide-react';

interface GiphyPickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (gif: GiphyGif) => void;
    sending?: boolean;
}

export default function GiphyPicker({ open, onClose, onSelect, sending }: GiphyPickerProps) {
    const [gifs, setGifs] = useState<GiphyGif[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTrending, setShowTrending] = useState(true);

    useEffect(() => {
        if (open) {
            loadTrending();
        }
    }, [open]);

    const loadTrending = async () => {
        setLoading(true);
        setShowTrending(true);
        setSearchQuery('');
        
        try {
            const response = await giphyService.trending(30);
            setGifs(response.data);
        } catch (error) {
            console.error('Error loading trending GIFs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            loadTrending();
            return;
        }

        setLoading(true);
        setShowTrending(false);
        try {
            const response = await giphyService.search(searchQuery, 30);
            setGifs(response.data);
        } catch (error) {
            console.error('Error searching GIFs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectGif = (gif: GiphyGif) => {
        onSelect(gif);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {showTrending ? (
                            <>
                                <TrendingUp className="h-5 w-5" />
                                Trending GIFs
                            </>
                        ) : (
                            <>
                                <Search className="h-5 w-5" />
                                Search GIFs
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        placeholder="Search for GIFs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={sending}
                    />
                    <Button type="submit" disabled={loading || sending}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                    <Button type="button" variant="outline" onClick={loadTrending} disabled={sending}>
                        <TrendingUp className="h-4 w-4" />
                    </Button>
                </form>

                <div className="overflow-y-auto max-h-96">
                    {loading || sending ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {gifs.map((gif) => (
                                <button
                                    key={gif.id}
                                    onClick={() => handleSelectGif(gif)}
                                    disabled={sending}
                                    className="relative aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <img
                                        src={gif.images.fixed_height.url}
                                        alt={gif.title}
                                        className="w-full h-full object-cover"
                                        loading='lazy'
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {!loading && !sending && gifs.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No GIFs found. Try a different search!
                        </div>
                    )}
                </div>

                <div className="text-xs text-muted-foreground text-center">
                    Powered by GIPHY
                </div>
            </DialogContent>
        </Dialog>
    );
}