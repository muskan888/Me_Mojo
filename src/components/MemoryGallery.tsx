import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Image, Plus, Heart, Calendar, Upload, X, ZoomIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PhotoCaptionGenerator } from "@/components/PhotoCaptionGenerator";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

interface MemoryGalleryProps {
  memories: any[];
  setMemories: (memories: any[]) => void;
}

export const MemoryGallery = ({
  memories,
  setMemories,
}: MemoryGalleryProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    mood: "",
    type: "moment",
    aiCaption: "",
    image: "",
  });
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const handleAddMemory = () => {
    if (!newMemory.title.trim()) return;

    const memory = {
      id: Date.now(),
      ...newMemory,
      createdAt: new Date().toISOString(),
    };

    setMemories([memory, ...memories]);
    setNewMemory({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      mood: "",
      type: "moment",
      aiCaption: "",
      image: "",
    });
    setShowAddForm(false);

    toast({
      title: "Memory saved! 💝",
      description: "Your moment has been preserved forever.",
    });
  };

  const handleCaptionGenerated = (caption: string) => {
    setNewMemory({ ...newMemory, aiCaption: caption });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setNewMemory({ ...newMemory, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleMemories = [
    {
      id: 1,
      title: "Perfect morning coffee",
      description:
        "The first sip of coffee this morning was pure bliss. Sometimes the simple moments are the most precious.",
      date: "2024-01-15",
      mood: "Content",
      type: "moment",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Call with mom",
      description:
        "Had the sweetest 2-hour call with mom. She told me stories about her childhood I'd never heard before.",
      date: "2024-01-14",
      mood: "Warm",
      type: "connection",
      createdAt: new Date().toISOString(),
    },
  ];

  const allMemories = memories.length > 0 ? memories : sampleMemories;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Memory Gallery</h2>
          <p className="text-muted-foreground">Moments worth remembering</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Memory
        </Button>
      </div>

      {showAddForm && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Capture a Memory ✨</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">
                Add a Photo
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="memory-image"
                  />
                  <label
                    htmlFor="memory-image"
                    className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-dashed rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </label>
                </div>
                {selectedImage && (
                  <div className="relative w-20 h-20">
                    <img
                      src={selectedImage}
                      alt="Selected memory"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setNewMemory({ ...newMemory, image: "" });
                      }}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <Input
              placeholder="What happened? 💭"
              value={newMemory.title}
              onChange={(e) =>
                setNewMemory({ ...newMemory, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Tell me more about this moment... 📝"
              value={newMemory.description}
              onChange={(e) =>
                setNewMemory({ ...newMemory, description: e.target.value })
              }
              className="min-h-24"
            />

            <PhotoCaptionGenerator
              onCaptionGenerated={handleCaptionGenerated}
            />

            {newMemory.aiCaption && (
              <div className="p-3 bg-secondary/20 rounded-lg">
                <p className="text-sm font-medium mb-1">AI Caption:</p>
                <p className="text-sm text-muted-foreground italic">
                  {newMemory.aiCaption}
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <Input
                type="date"
                value={newMemory.date}
                onChange={(e) =>
                  setNewMemory({ ...newMemory, date: e.target.value })
                }
              />
              <Input
                placeholder="How did it feel? 💫"
                value={newMemory.mood}
                onChange={(e) =>
                  setNewMemory({ ...newMemory, mood: e.target.value })
                }
              />
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleAddMemory}>
                <Heart className="w-4 h-4 mr-2" />
                Save Memory
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allMemories.map((memory, index) => (
          <Card
            key={memory.id}
            className="glass-effect hover:scale-[1.02] transition-transform duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {memory.image && (
              <div
                className="relative h-48 overflow-hidden rounded-t-lg cursor-pointer group"
                onClick={() => setModalImage(memory.image)}
              >
                <img
                  src={memory.image}
                  alt={memory.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Image className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg leading-tight">
                      {memory.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(memory.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {memory.mood && (
                  <Badge variant="outline" className="text-xs">
                    {memory.mood}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {memory.description}
              </p>
              {memory.aiCaption && (
                <p className="text-xs text-primary italic">
                  AI: "{memory.aiCaption}"
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {allMemories.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No memories yet</h3>
          <p className="text-muted-foreground mb-4">
            Start capturing the moments that matter to you
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Memory
          </Button>
        </div>
      )}

      {/* Image Modal */}
      <Dialog open={!!modalImage} onOpenChange={() => setModalImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
          {modalImage && (
            <div className="relative">
              <img
                src={modalImage}
                alt="Full size memory"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <DialogClose className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors">
                <X className="w-4 h-4" />
              </DialogClose>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
