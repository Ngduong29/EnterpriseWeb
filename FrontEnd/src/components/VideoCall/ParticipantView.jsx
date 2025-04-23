import React, { useEffect, useRef } from 'react';
import { Track } from 'livekit-client';

const ParticipantView = ({ participant, isLocal }) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        console.log('ParticipantView mounted for:', participant.identity);
        console.log('Participant tracks:', Array.from(participant.tracks.values()).map(t => t.trackName));

        // Hàm để thiết lập video track
        const handleTrackSubscribed = (track) => {
            console.log('Track subscribed:', track.kind, track.sid);

            if (track.kind === Track.Kind.Video) {
                console.log('Attaching video track to element for', participant.identity);
                try {
                    if (videoRef.current) {
                        track.attach(videoRef.current);
                        console.log('Video track attached successfully');
                    } else {
                        console.error('Video element reference is null');
                    }
                } catch (err) {
                    console.error('Error attaching video track:', err);
                }
            } else if (track.kind === Track.Kind.Audio) {
                console.log('Attaching audio track to element');
                try {
                    if (audioRef.current) {
                        track.attach(audioRef.current);
                        console.log('Audio track attached successfully');
                    } else {
                        console.error('Audio element reference is null');
                    }
                } catch (err) {
                    console.error('Error attaching audio track:', err);
                }
            }
        };

        // Hàm để xử lý khi track ngắt kết nối
        const handleTrackUnsubscribed = (track) => {
            console.log('Track unsubscribed:', track.kind);
            track.detach();
        };

        // Thiết lập các sự kiện để theo dõi track
        participant.on('trackSubscribed', handleTrackSubscribed);
        participant.on('trackUnsubscribed', handleTrackUnsubscribed);

        // Kiểm tra xem đã có tracks sẵn chưa
        participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
                handleTrackSubscribed(publication.track);
            }
        });

        return () => {
            participant.off('trackSubscribed', handleTrackSubscribed);
            participant.off('trackUnsubscribed', handleTrackUnsubscribed);

            // Dọn dẹp khi component unmount
            participant.tracks.forEach(publication => {
                if (publication.track) {
                    publication.track.detach();
                }
            });
        };
    }, [participant]);

    return (
        <div className={`bg-gray-800 rounded-lg overflow-hidden p-2 ${isLocal ? 'border-2 border-blue-500' : ''}`}>
            <div className="relative" style={{ minHeight: '200px' }}>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted={isLocal} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    className="rounded bg-black"
                />
                <audio ref={audioRef} autoPlay playsInline muted={isLocal} />
                
                {/* Hiển thị biểu tượng khi video không hoạt động */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                    {participant.identity} {isLocal ? '(You)' : ''}
                </div>
            </div>
        </div>
    );
};

export default ParticipantView;