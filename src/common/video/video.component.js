import * as React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/styles';
import useFileSelector from '../use-file-selector.hook';
import VideoOverlay from './video-overlay.component';
import { VideoControlsProvider } from './video-controls.context';

const useStyles = makeStyles({
	videoRoot: {
		position: 'relative',
		backgroundColor: 'black',
		width: p => p.width,
		height: p => p.height,
	},
	loaderRoot: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
		width: p => p.width,
		height: p => p.height,
	},
	video: {
		height: '100%',
		width: '100%',
	},
	overlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
	},
});

Video.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	captionSrc: PropTypes.string,
	onFileSelected: PropTypes.func.isRequired,
};

Video.defaultProps = {
	width: 400,
	height: 300,
};

export default function Video(props) {
	const { captionSrc, onFileSelected } = props;
	const [src, setSrc] = React.useState();
	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null);
	const classes = useStyles(props);
	const [videoRef, setVideoRef] = React.useState();
	const [videoContainerRef, setVideoContainerRef] = React.useState();

	const onFilesSelected = React.useCallback(
		e => {
			onCloseOptionsMenu();
			const [file] = e.target.files;
			if (src) URL.revokeObjectURL(src);
			const localUrl = URL.createObjectURL(file);
			setSrc(localUrl);
			onFileSelected(file);
		},
		[src, onFileSelected]
	);

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null);
	};

	const openFileSelector = useFileSelector({ accept: 'video/*', onFilesSelected });

	if (!src) {
		return (
			<div className={classes.loaderRoot}>
				<Button variant="contained" color="primary" onClick={openFileSelector}>
					Select Video File
				</Button>
			</div>
		);
	}

	return (
		<VideoControlsProvider videoRef={videoRef} videoContainerRef={videoContainerRef}>
			<div ref={setVideoContainerRef} className={classes.videoRoot}>
				{/* key is necessary here to tell react to reload the video if src is different: https://stackoverflow.com/a/47382850/2382483 */}
				<video key={src} ref={setVideoRef} className={classes.video}>
					<source src={src} />
					<track src={captionSrc} default kind="subtitles" srcLang="en" label="English" />
				</video>
				<VideoOverlay
					className={classes.overlay}
					videoContainerRef={videoContainerRef}
					topElement={
						<React.Fragment>
							<IconButton
								color="inherit"
								aria-label="Video Options"
								onClick={e => setOptionsMenuAnchorEl(e.currentTarget)}>
								<MoreIcon />
							</IconButton>
							<Menu anchorEl={optionsMenuAnchorEl} open={!!optionsMenuAnchorEl} onClose={onCloseOptionsMenu}>
								<MenuItem onClick={openFileSelector}>Select New Video File...</MenuItem>
							</Menu>
						</React.Fragment>
					}
				/>
			</div>
		</VideoControlsProvider>
	);
}