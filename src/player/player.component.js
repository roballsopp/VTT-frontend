import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import VideoControls from '../common/video/video-controls.component';
import VttTimeline from '../vtt-timeline';
import { OverlayProvider, useVideoDom } from '../common/video';
import Video from './video.component';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	videoContainer: {
		flex: 1,
		backgroundColor: 'black',
		minHeight: 0,
		minWidth: 0,
	},
	video: {
		height: 'calc(100% - 38px)',
		margin: 'auto',
		maxWidth: 1000,
	},
	vttTimeline: {
		flex: 1,
		maxHeight: 300,
		minHeight: 100,
	},
});

export default function Player() {
	const classes = useStyles();
	const { onVideoContainerRef } = useVideoDom();

	return (
		<OverlayProvider>
			<div className={classes.root}>
				<div ref={onVideoContainerRef} className={classes.videoContainer}>
					<Video className={classes.video} />
					<VideoControls />
				</div>
				<div className={classes.vttTimeline}>
					<VttTimeline />
				</div>
			</div>
		</OverlayProvider>
	);
}
