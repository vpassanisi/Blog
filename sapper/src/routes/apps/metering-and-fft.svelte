<script>
  import * as d3 from "d3";
  import { Volume, Meter, Split, Merge, Analyser, Player } from "tone";
  import { onMount } from "svelte";
  import { darkMode } from "../../store/darkMode";
  const svgHeight = 600;
  const svgWidth = 200;
  const barPadding = 1;
  const scaleHeight = 600;
  const scaleWidth = 5;
  const fftHeight = 600;
  const fftWidth = 1024;
  let files;
  let url;
  let player;
  let loading = false;
  let range = 50;
  let smoothing = 0.9;
  let volume;
  let meterL;
  let meterR;
  let split;
  let merge;
  let rmsL = -60;
  let rmsR = -60;
  let request;
  let dataArr = [svgHeight, svgHeight];
  let graph;
  let scale;
  let fft;
  let bin = [8192, 8, 4];
  let fftNode;
  let fftArr = [];
  while (fftArr.length < bin[0]) {
    fftArr.push(0);
  }
  const calcSmoothing = (val) => {
    const minp = 0;
    const maxp = 100;
    const minv = 0;
    const maxv = Math.log(100);
    const scale = (maxv - minv) / (maxp - minp);
    return Math.exp(minv + scale * (val - minp));
  };
  const toLog = (value, min, max) => {
    const exp = (value - min) / (max - min);
    return min * Math.pow(max / min, exp);
  };
  const updateLoop = () => {
    request = requestAnimationFrame(updateLoop);
    volume.volume.value = -Math.pow(range, 2.5) / 1000;
    meterL.smoothing = 1 - calcSmoothing(smoothing) / 100;
    meterR.smoothing = 1 - calcSmoothing(smoothing) / 100;
    fftNode.smoothing = 1 - calcSmoothing(smoothing) / 100;
    fftNode.size = bin[0];
    rmsL = meterL.getValue();
    if (rmsL < -60) rmsL = -60;
    rmsR = meterR.getValue();
    if (rmsR < -60) rmsR = -60;
    dataArr = [Math.abs(rmsL), Math.abs(rmsR)];
    graph
      .selectAll("rect")
      .data(dataArr)
      .attr("y", (d) => d * (svgHeight / 60))
      .attr("height", (d) => svgHeight - d * (svgHeight / 60))
      .style("fill", (d) => ($darkMode ? "white" : "#323232"));
    scale
      .selectAll("rect")
      .style("fill", (d) => ($darkMode ? "white" : "#323232"));
    const arr = fftNode.getValue();
    let logArr = [];
    for (let i = bin[2]; i < arr.length; i += bin[1]) {
      const logindex = toLog(i, bin[2], bin[0]);
      const low = Math.floor(logindex);
      const high = Math.ceil(logindex);
      const lv = Math.abs(arr[low]);
      const hv = Math.abs(arr[high]);
      const w = (logindex - low) / (high - low);
      let v = lv + (hv - lv) * w;
      if (isNaN(v)) v = 100;
      logArr.push(v);
    }
    fft
      .selectAll("rect")
      .data(logArr)
      .attr("y", (d) => {
        if (d < -100) d = -100;
        return Math.abs(d) * (svgHeight / 100);
      })
      .attr("x", (d, i) => i * (fftWidth / logArr.length))
      .attr("width", fftWidth / logArr.length)
      .attr("height", (d) => {
        if (d < -100) d = 100;
        return Math.abs(fftHeight - Math.abs(d) * (svgHeight / 100));
      })
      .style("fill", (d) => ($darkMode ? "white" : "#323232"));
  };
  const startAnimationLoop = () => {
    requestAnimationFrame(updateLoop);
  };
  const stopAnimationLoop = () => {
    cancelAnimationFrame(request);
  };

  let handleChange;
  onMount(() => {
    volume = new Volume(-range);
    meterL = new Meter(0.9);
    meterR = new Meter(0.9);
    split = new Split();
    merge = new Merge();

    fftNode = new Analyser("fft", bin[0]);

    handleChange = () => {
      loading = true;
      url = URL.createObjectURL(files[0]);
      player = new Player(url, () => (loading = false));
      player.fan(split);
      split.connect(meterL, 0);
      split.connect(meterR, 1);
      meterL.connect(merge, 0, 0);
      meterR.connect(merge, 0, 1);
      merge.fan(volume, fftNode);
      volume.toDestination();
    };

    const createSvg = (parent, height, width) => {
      return d3
        .select(parent)
        .append("svg")
        .attr("height", height)
        .attr("width", width);
    };

    graph = createSvg("#graph", svgHeight, svgWidth);
    graph
      .selectAll("rect")
      .data(dataArr)
      .enter()
      .append("rect")
      .attr("width", svgWidth / dataArr.length - barPadding)
      .attr("height", (d) => svgHeight)
      .attr("x", (d, i) => i * (svgWidth / dataArr.length))
      .attr("y", (d) => svgHeight);
    scale = createSvg("#scale", scaleHeight, scaleWidth);
    scale
      .selectAll("rect")
      .data([
        0,
        3,
        6,
        9,
        12,
        15,
        18,
        21,
        24,
        27,
        30,
        33,
        36,
        39,
        42,
        45,
        48,
        51,
        54,
        57,
        59.9,
      ])
      .enter()
      .append("rect")
      .attr("width", scaleWidth)
      .attr("height", 1)
      .attr("x", 1)
      .attr("y", (d) => d * (svgHeight / 60))
      .style("fill", (d) => ($darkMode ? "white" : "#323232"));
    fft = createSvg("#FFT", fftHeight, fftWidth);
    fft.selectAll("rect").data(fftArr).enter().append("rect");
  });
</script>

<div class="container">
  <div class="container__controlls">
    <div class="contianer__file">
      <input
        bind:files
        type="file"
        accept="audio/*"
        on:change={() => (handleChange ? handleChange() : null)}
      />
    </div>
    <button
      on:click={() => {
        player.start();
        startAnimationLoop();
      }}
      class="container__play"
    >
      {#if loading}WAIT{:else}Play{/if}
    </button>
    <button
      on:click={() => {
        player.stop();
        stopAnimationLoop();
      }}
      class="container__stop"
    >
      STOP
    </button>
    <div>
      <span>Volume</span>
      <input
        class="container__volume"
        bind:value={range}
        min="0"
        max="100"
        type="range"
      />
    </div>
    <!-- <audio
        class="w-64 h-12"
        controls
        src="./Katy-Perry-Never-Really-Over.flac"
        preload="auto" /> -->
  </div>

  <div>
    <div class="container__graphs">
      <div class="graphs__fft">
        <div id="FFT" />
      </div>
      <div class="graphs__rms">
        <div class="graphs__meter">
          <div class="meter__numbers">
            <small>0</small>
            <small>3</small>
            <small>6</small>
            <small>9</small>
            <small>12</small>
            <small>15</small>
            <small>18</small>
            <small>21</small>
            <small>25</small>
            <small>27</small>
            <small>30</small>
            <small>33</small>
            <small>36</small>
            <small>39</small>
            <small>42</small>
            <small>45</small>
            <small>48</small>
            <small>51</small>
            <small>54</small>
            <small>57</small>
            <small>60</small>
          </div>
          <div id="scale" class="graphs__l" />
          <div id="graph" class="graphs__r" />
        </div>
        <div class="graphs__numbers">
          <div class="numbers__l">
            {rmsL.toPrecision(3)}
          </div>
          <div class="numbers__r">
            {rmsR.toPrecision(3)}
          </div>
        </div>
      </div>
    </div>

    <div class="graphs__settings">
      <div class="settings__smoothing">
        <span>
          Smoothing: {(1 - calcSmoothing(smoothing) / 100).toPrecision(3)}
        </span>
        <input bind:value={smoothing} min="0" max="99" type="range" />
      </div>
      <div class="settings__depth">
        <div>FFT Depth:</div>
        <select id="bin-depth" bind:value={bin}>
          <option value={[1024, 1, 1]}>1024</option>
          <option value={[2048, 2, 1]}>2048</option>
          <option selected="selected" value={[4096, 4, 2]}>4096</option>
          <option value={[8192, 8, 4]}>8192</option>
          <option value={[16384, 16, 8]}>16384</option>
        </select>
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    margin-top: 8rem;
  }

  .container__controlls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    height: 2rem;
    margin-bottom: 1rem;
  }

  .contianer__file {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--dark-gray-800);
    border-radius: 5px;
    height: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-right: 1rem;
  }
  :global(.dark .contianer__file) {
    border: 2px solid white !important;
  }

  .container__play {
    height: 100%;
    background-color: transparent;
    border: 2px solid var(--dark-gray-800);
    border-radius: 5px;
    color: currentColor;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-right: 1rem;
  }
  :global(.dark .container__play) {
    border: 2px solid white !important;
  }

  .container__stop {
    height: 100%;
    background-color: transparent;
    border: 2px solid var(--dark-gray-800);
    border-radius: 5px;
    color: currentColor;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-right: 1rem;
  }
  :global(.dark .container__stop) {
    border: 2px solid white !important;
  }

  .container__volume {
    transform: rotate(180deg);
  }

  .container__graphs {
    display: flex;
    justify-content: center;
    flex-direction: row;
    overflow-x: auto;
  }

  .graphs__fft {
    display: flex;
    align-items: flex-end;
    border: 2px solid var(--dark-gray-800);
    border-radius: 5px;
    margin-right: 0.5rem;
  }
  :global(.dark .graphs__fft) {
    border: 2px solid white !important;
  }

  .graphs__rms {
    border: 2px solid var(--dark-gray-800);
    border-radius: 5px;
    padding: 0.5rem;
  }
  :global(.dark .graphs__rms) {
    border: 2px solid white !important;
  }

  .graphs__meter {
    display: flex;
    flex-direction: row;
  }

  .meter__numbers {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-top: -0.5rem;
    margin-bottom: -0.5rem;
  }

  .graphs__l {
    display: inline-block;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }

  .graphs__r {
    display: inline-block;
    width: 100%;
  }

  .graphs__numbers {
    display: flex;
    margin-left: 1.75rem;
  }

  .numbers__l {
    width: 50%;
    text-align: center;
  }

  .numbers__r {
    width: 50%;
    text-align: center;
  }

  .graphs__settings {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 6rem;
    max-width: 1024px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: auto;
    margin-right: auto;
  }

  .settings__smoothing {
    display: flex;
    flex-direction: column;
    border: 2px solid var(--dark-gray-800);
    border-radius: 5px;
    padding: 0.25rem;
    margin: 0.25rem;
    width: 50%;
  }
  :global(.dark .settings__smoothing) {
    border: 2px solid white !important;
  }

  .settings__smoothing input {
    width: 100%;
  }

  .settings__depth {
    display: flex;
    flex-direction: column;
    width: 25%;
    border: 2px solid var(--dark-gray-800);
    border-radius: 5px;
    padding: 0.25rem;
  }
  :global(.dark .settings__depth) {
    border: 2px solid white !important;
  }
</style>
