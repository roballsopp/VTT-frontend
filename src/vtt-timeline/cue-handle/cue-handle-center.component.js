import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useDragging } from '../../common';
import { useCueTrack } from '../cue-track-context';
import { useZoom } from '../zoom-container.component';

const useStyles = makeStyles({
	root: {
		opacity: 0,
		'&:hover': {
			opacity: 0.05,
		},
	},
});

CueHandleCenter.propTypes = {
	cueIndex: PropTypes.number.isRequired,
	onDragging: PropTypes.func.isRequired,
	onChangeCueTiming: PropTypes.func.isRequired,
	className: PropTypes.string,
};

function CueHandleCenter({ cueIndex, onDragging, onChangeCueTiming, className }) {
	const classes = useStyles();
	const [handleRef, setHandleRef] = React.useState();
	const startPosRef = React.useRef(0);
	const prevPosRef = React.useRef(0);
	const { pixelsPerSec } = useZoom();
	const { trackEl } = useCueTrack();

	useDragging(handleRef, {
		onDragStart: React.useCallback(
			e => {
				// we use client bounding box to get relative position to the track element so that scrolling while sliding works as expected
				const bbox = trackEl.getBoundingClientRect();
				const relPos = e.clientX - bbox.x;
				startPosRef.current = relPos;
				prevPosRef.current = relPos;
			},
			[trackEl]
		),
		onDragging: React.useCallback(
			e => {
				const bbox = trackEl.getBoundingClientRect();
				const relPos = e.clientX - bbox.x;
				onDragging(relPos - prevPosRef.current);
				prevPosRef.current = relPos;
			},
			[onDragging, trackEl]
		),
		onDragEnd: React.useCallback(
			e => {
				const bbox = trackEl.getBoundingClientRect();
				const relPos = e.clientX - bbox.x;
				const d = (relPos - startPosRef.current) / pixelsPerSec;
				onChangeCueTiming(cueIndex, { startDelta: d, endDelta: d });
			},
			[trackEl, cueIndex, pixelsPerSec, onChangeCueTiming]
		),
	});

	return <div ref={setHandleRef} className={clsx(classes.root, className)} />;
}

export default React.memo(CueHandleCenter);
