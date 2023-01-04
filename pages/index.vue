<script setup>

const surahList = ref();
const currentSurah = ref(1);
const suraDataAr = ref();
const surahDataBn = ref();
const currentAyahTracks = ref([]);
const currentAyahNumbers = ref([]);
const currentAyahNumber = ref(1);
const firstAyahAudio = ref('https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3');
const audioLoop = ref('2');
const surahReloaded = ref(false);
const pageLoading = ref(true);
const reciterList = ref();
const currentReciter = ref('ar.alafasy');

onBeforeMount(() => {

    // Setting initial values
    currentSurah.value = getStoredData('currentSurah', 1);
    currentReciter.value = getStoredData('currentReciter', 'ar.alafasy');
    audioLoop.value = getStoredData('audioLoop', '2');

    // Preloading list of surah
	LoadSurahList();

    // Preloading list of reciter
    LoadReciterList();

    // Preloading first ayah
    loadFirstAyahAudio();

    // initial first surah load 
    querySurah();
})

onMounted(() => {
    loopCheckboxSelection();
})

/**
 * save data to localStorage
 * @param {string} key data key
 * @param {mix} value data value to store
 */
function storeData( key, value ){
	localStorage.setItem(key, value);
}

/**
 * getting localStorage data if any otherwise default
 * @param {string} key data key of value
 * @param {mix} defaultValue default data if not found
 */
function getStoredData( key, defaultValue ){
	let data = localStorage.getItem(key);
    if(data === 'true'){
        return true;
    }
    if(data === 'false'){
        return false;
    }
	return data ? data : defaultValue;
}

/**
 * Loading list of surah
 */
const LoadSurahList = async () => {
    await useFetch('https://api.alquran.cloud/v1/surah', {
        onResponse({ request, response, options }) {
            return surahList.value = response._data.data;
        }
    });
}

/**
 * Loading list of reciter
 */
const LoadReciterList = async () => {
    await useFetch('https://api.alquran.cloud/v1/edition/format/audio', {
        onResponse({ request, response, options }) {
            return reciterList.value = response._data.data;
        }
    });
}

/**
 * Loading first ayah (bismillah) audio of current reciter
 */
const loadFirstAyahAudio = async () => {
    await useFetch(`https://api.alquran.cloud/v1/ayah/1/${currentReciter.value}`, {
        onResponse({ request, response, options }) {
            return firstAyahAudio.value = response._data.data.audio;
        }
    });
}

/**
 * getting surah details by surah number
 */
const querySurah = async () => {

    // Init values
    surahReloaded.value = true;
	pageLoading.value = true;

    await useFetch(`https://api.alquran.cloud/v1/surah/${currentSurah.value}/editions/${currentReciter.value},bn.bengali`, {
        onResponse({ request, response, options }) {

            suraDataAr.value = response._data.data[0];
            surahDataBn.value = response._data.data[1];

            // clear old values before load new
			currentAyahTracks.value = [];
			currentAyahNumbers.value = [];

            // looping response to collet ayah
			response._data.data[0].ayahs.forEach(function (item, index) {
				// console.log(item.number);
				// currentAyahTracks.value[index] = item.audio;
				currentAyahTracks.value[item.number] = item.audio;
				currentAyahNumbers.value[index] = item.number;
			});

            // reset player as new track loaded
			resetPlayer();
            // resetting loading animation
            pageLoading.value = false;
        }
    });
}

/**
 * getting surah number on select change
 */
 function handleSurahListChange(e) {
	currentSurah.value = e.target.value;
	// setCurrentSurah(e.target.value);
    storeData( 'currentSurah', e.target.value );
	querySurah();
}

/**
 * getting reciter identifier on select change
 */
function handleReciterListChange(e) {
	currentReciter.value = e.target.value;
	// setCurrentReciter(e.target.value);
    storeData( 'currentReciter', e.target.value );
	loadFirstAyahAudio();
	querySurah();
}

/**
 * Run while audio is playing
 */
 function onAudioPlaying(e){

    let audio = document.getElementById('audioPlayer');
    currentAyahNumber.value = audio.getAttribute('data-current');
    surahReloaded.value = false;
    highlightAyah();
}

/**
 * call once player ended a track automatically
 */
function onAudioTrackEnd(e) {

	let audio = document.getElementById('audioPlayer');
	let currentlyPlaying = audio.getAttribute('data-current');

    // check if first ayah of first surah
	if(currentlyPlaying == 1 && currentAyahNumbers.value[0] == 1){
		currentlyPlaying = currentAyahNumbers.value[1];
	} else {
        // check if first ayah
		if(currentlyPlaying == 1 ){
			currentlyPlaying = currentAyahNumbers.value[0];
		}else{
			++currentlyPlaying;
		}
	}

    // if track exist in track array by ayah number index
	if (currentAyahTracks.value[currentlyPlaying]) {
		audio.setAttribute('data-current', currentlyPlaying);
		audio.src = currentAyahTracks.value[currentlyPlaying];
		audio.load();
		audio.play();
        highlightAyah();
	} else {
        // we are end of current track list
        if(audioLoop.value == '2'){
            goToNextSurah();
        } else {
            resetHighlightAyah();
            resetPlayer();
        }
	}
	
}

/**
 * Handle player paused or track ended automatically
 */
 function handlePause(e){

    resetHighlightAyah();
}

/**
 * reset player
 */
function resetPlayer() {

	let audio = document.getElementById('audioPlayer');
	if(audio){
		audio.setAttribute('data-current', 1);
		currentAyahNumber.value = 1;
		audio.src = firstAyahAudio.value;
		audio.load();

		if(audioLoop.value == '1' && surahReloaded.value == false){
			audio.play();
		} else if(audioLoop.value == '2' && surahReloaded.value == false) {
            audio.play();
        } else {
			audio.pause();
        }
	}
}

/**
 * Highlight ayah based on what currently playing
 */
function highlightAyah(){

    // before highlight new ayah clear previous
	resetHighlightAyah();
	
	let currentAyah = document.getElementById(currentAyahNumber.value);
	if(currentAyah){
		currentAyah.classList.add('ayah-playing');
		currentAyah.scrollIntoView({
			behavior: 'smooth'
		});
	}
}

/**
 * Reset previous highlighted ayah
 */
 function resetHighlightAyah(){
	document.querySelectorAll('.ayah').forEach(function(ayahElement) {
        ayahElement.classList.replace('ayah-playing','ayah-played');
    });
}

/**
 * Handle loop selection checkbox
 */
 function handleLoopChange(e){
    
	audioLoop.value = e.target.value;
    storeData( 'audioLoop', e.target.value );
}

/**
 * Handle audio loop selection
 */
function loopCheckboxSelection(){

    let audioLoopSelect = document.getElementById('audioLoopSelect');
    
    if( audioLoopSelect ){
        if( audioLoop.value == 0 || audioLoop.value == 1 || audioLoop.value == 2 ){
            audioLoopSelect.value = audioLoop.value;
        }
    }
}

function goToNextSurah(){
    let nextSurah = ++currentSurah.value;
    if( nextSurah > 114){
        nextSurah = 1;
    }

    let surahListSelect = document.querySelector('#surahListSelect');
    surahListSelect.value = nextSurah;
    surahListSelect.dispatchEvent(new Event('change'));

    let audio = document.getElementById('audioPlayer');
    audio.play();
}
</script>


<template>

    <div class="fixed left-0 bottom-0 w-full bg-white z-10 border-t shadow-[0_30px_50px_15px_rgba(0,0,0,0.6)]">
        <div v-if="pageLoading" class="relative">
            <div class="h-48 sm:h-16 mb-0 loading"></div>
        </div>
        <div v-show="pageLoading == false" class="container px-6 py-3 flex justify-between items-center mx-auto flex-col md:flex-row text-arabic">

            <select @change="handleReciterListChange" class="block rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                <template v-for="reciter in reciterList">
                    <option v-if="reciter.language == 'ar'" :value="reciter.identifier" :selected="reciter.identifier == currentReciter ? true : false">
                        {{ reciter.englishName }}
                    </option>
                </template>
            </select>

            <select @change="handleSurahListChange" id="surahListSelect" class="block rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                <option v-for="surah in surahList" :value="surah.number" :selected="surah.number == currentSurah ? true : false">
                    [{{ surah.number }}] {{ surah.name }} ({{ surah.englishName }})
                </option>
            </select>

            <audio v-if="currentAyahTracks[currentAyahNumbers[0]]" @ended="onAudioTrackEnd" @play="onAudioPlaying" @pause="handlePause" :data-current="currentAyahNumber" id="audioPlayer" controls>
                <source :src="firstAyahAudio" type="audio/mpeg">
            </audio>

            <select @change="handleLoopChange" id="audioLoopSelect" class="block rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                <option value="0" :selected="audioLoop == '0' ? true : false">
                    Don't Loop
                </option>
                <option value="1" :selected="audioLoop == '1' ? true : false">
                    Loop this surah
                </option>
                <option value="2" :selected="audioLoop == '2' ? true : false">
                    Continue next
                </option>
            </select>

        </div>
    </div>

    <div class="relative border border-gray-200 px-8 py-8 bg-slate-100">
        <div v-if="suraDataAr" class="flex justify-center text-xs sm:text-base mb-4 pb-4 text-arabic">
            <p class="px-0">[{{ suraDataAr.englishName }}]</p>
            <p class="px-2">[{{ suraDataAr.englishNameTranslation }}]</p>
            <p class="px-0">[{{ suraDataAr.name }}]</p>
        </div>
        <p class="text-2xl sm:text-4xl text-center text-arabic">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
    </div>

    <div class="relative">
        <div v-show="pageLoading" class="border border-t-0 p-6">
            <!-- <div class="spinner"></div><p class="text-lg text-gray-400">Loading...</p> -->
            <div class="h-28 mb-5 last-of-type:m-0 loading"></div>
            <div class="h-28 mb-5 last-of-type:m-0 loading"></div>
            <div class="h-28 mb-5 last-of-type:m-0 loading"></div>
            <div class="h-28 mb-5 last-of-type:m-0 loading"></div>
            <div class="h-28 mb-5 last-of-type:m-0 loading"></div>
        </div>

        <div v-if="suraDataAr && pageLoading == false" class="relative border border-gray-200 p-0 sm:p-8 border-t-0" id="ayahs-holder">
            <div v-for="(ayah, rowindex) in suraDataAr.ayahs" :key="ayah.number" :id="ayah.number"
                class="ayah border-b border-gray-200 py-6 last-of-type:border-0 text-gray-600 duration-500">
                <p class="text-2xl text-center px-4 mb-4 text-arabic">
                    <span class="text-sm border rounded-full px-2 py-1 inline-block">{{ ayah.numberInSurah }}</span> {{ ayah.text }}
                </p>
                <p class="text-xl text-center px-4 text-bengali">
                    {{ surahDataBn.ayahs[rowindex].text }}
                </p>
            </div>
        </div>
    </div>

    <div class="gap h-56 md:h-20"></div>

</template>
