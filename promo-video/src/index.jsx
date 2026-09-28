import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {PortfolioReel} from './reel';

const Root = () => <Composition id="PortfolioReel" component={PortfolioReel} width={1080} height={1920} fps={30} durationInFrames={1290} />;
registerRoot(Root);
