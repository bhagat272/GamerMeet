import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  getFavoriteGame,
  getGameSchedule,
  getGamingGenre,
  getGamingPlatform,
  getPlayingStyle,
} from '../redux/actions/appSessionAction';
import {Colors} from '../theme';
import fonts from '../theme/fonts';
import imagePath from '../theme/imagePath';
import AppButton from './commonButton';
import GamingBoxShimmer from './GamingBoxShimmer';
import {translateText} from '../utils/language';

const {width} = Dimensions.get('window');

const CustomRangeSliderLabel = ({
  oneMarkerValue,
  twoMarkerValue,
  oneMarkerLeftPosition,
  twoMarkerLeftPosition,
  suffix = '',
}: {
  oneMarkerValue: number;
  twoMarkerValue: number;
  oneMarkerLeftPosition: number;
  twoMarkerLeftPosition: number;
  suffix?: string;
}) => (
  <>
    <View
      style={[styles.customLabelContainer, {left: oneMarkerLeftPosition - 20}]}>
      <Text style={styles.sliderLabel}>
        {oneMarkerValue}
        {suffix}
      </Text>
    </View>
    <View
      style={[styles.customLabelContainer, {left: twoMarkerLeftPosition - 20}]}>
      <Text style={styles.sliderLabel}>
        {twoMarkerValue}
        {suffix}
      </Text>
    </View>
  </>
);

const CustomSliderLabelWithMiles = (props: any) => (
  <CustomRangeSliderLabel {...props} suffix=" mil" />
);

const CustomSliderLabelWithYears = (props: any) => (
  <CustomRangeSliderLabel {...props} suffix=" yrs" />
);

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  onReset: () => void;
  filterLoading?: boolean;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  onReset,
  filterLoading,
}) => {
  const dispatch = useDispatch();

  // use arrays for ranges
  const [distance, setDistance] = useState<number[]>([0, 100]);
  const [ageRange, setAgeRange] = useState<number[]>([18, 45]);
  const [onlineStatus, setOnlineStatus] = useState<boolean | null>(null);
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);

  const [lastAppliedSnapshot, setLastAppliedSnapshot] = useState({
    distance: [0, 100] as number[],
    ageRange: [18, 45] as number[],
    onlineStatus: null as boolean | null,
    selected: {
      gamingPlatforms: [] as string[],
      gameGenres: [] as string[],
      favoriteGames: [] as string[],
      playingStyle: [] as string[],
      gamingSchedule: [] as string[],
    },
  });

  const [selected, setSelected] = useState({
    gamingPlatforms: [] as string[],
    gameGenres: [] as string[],
    favoriteGames: [] as string[],
    playingStyle: [] as string[],
    gamingSchedule: [] as string[],
  });

  const [gamingPlatformOptions, setGamingPlatformOptions] = useState<
    {id: string; name: string}[]
  >([]);
  const [gamingGenreOptions, setGamingGenreOptions] = useState<
    {id: string; name: string}[]
  >([]);
  const [favoriteGameOptions, setFavoriteGameOptions] = useState<
    {id: string; name: string}[]
  >([]);
  const [playingStyleOptions, setPlayingStyleOptions] = useState<
    {id: string; name: string}[]
  >([]);
  const [gamingScheduleOptions, setGamingSchedule] = useState<
    {id: string; name: string}[]
  >([]);

  useEffect(() => {
    if (visible) {
      setIsOptionsLoading(true);
      Promise.all([
        fetchGamingPlatform(),
        fetchGamingGenre(),
        fetchFavoriteGame(),
        fetchPlayingStyle(),
        fetchGamingSchedule(),
      ]).finally(() => setIsOptionsLoading(false));
    } else {
      // Revert any un-applied changes when modal closes
      setDistance(lastAppliedSnapshot.distance);
      setAgeRange(lastAppliedSnapshot.ageRange);
      setOnlineStatus(lastAppliedSnapshot.onlineStatus);
      setSelected({...lastAppliedSnapshot.selected});
    }
  }, [visible, dispatch]);

  const fetchGamingPlatform = async () => {
    try {
      const response = await dispatch(getGamingPlatform({}));
      if (response?.data) {
        setGamingPlatformOptions(
          response.data.map((item: {_id: string; name: string}) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching gaming platforms:', error);
    }
  };

  const fetchGamingGenre = async () => {
    try {
      const response = await dispatch(getGamingGenre({}));
      if (response?.data) {
        setGamingGenreOptions(
          response.data.map((item: {_id: string; name: string}) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching gaming genre:', error);
    }
  };

  const fetchFavoriteGame = async () => {
    try {
      const response = await dispatch(getFavoriteGame({}));
      if (response?.data) {
        setFavoriteGameOptions(
          response.data.map((item: {_id: string; name: string}) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching favorite game:', error);
    }
  };

  const fetchPlayingStyle = async () => {
    try {
      const response = await dispatch(getPlayingStyle({}));
      if (response?.data) {
        setPlayingStyleOptions(
          response.data.map((item: {_id: string; name: string}) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching playing style:', error);
    }
  };

  const fetchGamingSchedule = async () => {
    try {
      const response = await dispatch(getGameSchedule({}));
      if (response?.data) {
        setGamingSchedule(
          response.data.map((item: {_id: string; name: string}) => ({
            id: item._id,
            name: item.name,
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const toggleSelection = (category: keyof typeof selected, item: string) => {
    const current = selected[category];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    setSelected({...selected, [category]: updated});
  };

  const handleApply = async () => {
    const filters: {[key: string]: any} = {};

    if (ageRange && ageRange.length === 2) {
      filters.age = ageRange;
    }
    if (distance && distance.length === 2) {
      filters.distance = distance;
    }
    if (onlineStatus !== null) {
      filters.is_online = onlineStatus;
    }
    if (selected.gameGenres.length > 0) {
      filters.game_genre = selected.gameGenres.map(
        name => gamingGenreOptions.find(item => item.name === name)?.id || '',
      );
    }
    if (selected.gamingPlatforms.length > 0) {
      filters.gaming_platform = selected.gamingPlatforms.map(
        name =>
          gamingPlatformOptions.find(item => item.name === name)?.id || '',
      );
    }
    if (selected.favoriteGames.length > 0) {
      filters.favourite_game = selected.favoriteGames.map(
        name => favoriteGameOptions.find(item => item.name === name)?.id || '',
      );
    }
    if (selected.playingStyle.length > 0) {
      filters.playing_style = selected.playingStyle.map(
        name => playingStyleOptions.find(item => item.name === name)?.id || '',
      );
    }
    if (selected.gamingSchedule.length > 0) {
      filters.game_schedule = selected.gamingSchedule.map(
        name =>
          gamingScheduleOptions.find(item => item.name === name)?.id || '',
      );
    }

    onApply(filters);

    setLastAppliedSnapshot({
      distance: [...distance],
      ageRange: [...ageRange],
      onlineStatus,
      selected: {
        gamingPlatforms: [...selected.gamingPlatforms],
        gameGenres: [...selected.gameGenres],
        favoriteGames: [...selected.favoriteGames],
        playingStyle: [...selected.playingStyle],
        gamingSchedule: [...selected.gamingSchedule],
      },
    });
  };

  const handleReset = () => {
    const clearedSnapshot = {
      distance: [0, 100],
      ageRange: [18, 45],
      onlineStatus: null,
      selected: {
        gamingPlatforms: [],
        gameGenres: [],
        favoriteGames: [],
        playingStyle: [],
        gamingSchedule: [],
      },
    };

    setDistance([0, 100]);
    setAgeRange([18, 45]);
    setOnlineStatus(null);
    setSelected(clearedSnapshot.selected);
    setLastAppliedSnapshot(clearedSnapshot);

    onReset();
  };

  const renderChips = (
    data: {id: string; name: string}[],
    category: keyof typeof selected,
  ) => (
    <View style={styles.chipContainer}>
      {data.map(item => {
        const isSelected = selected[category].includes(item.name);
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => toggleSelection(category, item.name)}>
            <Text
              style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}>
          <View style={styles.bottomOverlay}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{translateText('filter')}</Text>
              <TouchableOpacity onPress={onClose} hitSlop={6}>
                <Image
                  source={imagePath.close_circle_line}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}>
              <Text style={styles.label}>{translateText('distance')}</Text>
              <MultiSlider
                values={distance}
                min={0}
                max={100}
                customLabel={CustomSliderLabelWithMiles}
                sliderLength={width - 49 - 10}
                onValuesChange={values => setDistance(values)}
                selectedStyle={styles.selectedTrack}
                unselectedStyle={styles.unselectedTrack}
                trackStyle={styles.sliderTrackAge}
                markerStyle={styles.sliderMarker}
                enableLabel
              />

              <Text style={styles.label}>{translateText('age')}</Text>
              <MultiSlider
                values={ageRange}
                min={18}
                max={45}
                sliderLength={width - 49 - 10}
                customLabel={CustomSliderLabelWithYears}
                customMarkerRight={CustomSliderLabelWithYears}
                selectedStyle={styles.selectedTrack}
                onValuesChange={values => setAgeRange(values)}
                unselectedStyle={styles.unselectedTrack}
                trackStyle={styles.sliderTrackAge}
                markerStyle={styles.sliderMarker}
                enableLabel
              />

              <View style={styles.sliderRangeLabelRow}>
                <Text style={styles.rangeText}>{translateText('min_18')}</Text>
                <Text style={styles.rangeText}>{translateText('max_45')}</Text>
              </View>

              <Text style={styles.label}>
                {translateText('gaming_platforms')}
              </Text>
              {gamingPlatformOptions.length ? (
                renderChips(gamingPlatformOptions, 'gamingPlatforms')
              ) : (
                <GamingBoxShimmer boxNumber={3} />
              )}

              <Text style={styles.label}>{translateText('game_genres')}</Text>
              {gamingGenreOptions.length ? (
                renderChips(gamingGenreOptions, 'gameGenres')
              ) : (
                <GamingBoxShimmer boxNumber={2} />
              )}

              <Text style={styles.label}>
                {translateText('favorite_games')}
              </Text>
              {favoriteGameOptions.length ? (
                renderChips(favoriteGameOptions, 'favoriteGames')
              ) : (
                <GamingBoxShimmer boxNumber={2} />
              )}

              <Text style={styles.label}>{translateText('playing_style')}</Text>
              {playingStyleOptions.length ? (
                renderChips(playingStyleOptions, 'playingStyle')
              ) : (
                <GamingBoxShimmer boxNumber={4} />
              )}

              <Text style={styles.label}>
                {translateText('gaming_schedule')}
              </Text>
              {gamingScheduleOptions.length ? (
                renderChips(gamingScheduleOptions, 'gamingSchedule')
              ) : (
                <GamingBoxShimmer boxNumber={4} />
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  setOnlineStatus(prev => (prev === null ? true : !prev))
                }
                style={styles.toggleButton}>
                <Text style={styles.label}>
                  {translateText('online_status')}
                </Text>
                <Image
                  source={
                    onlineStatus ? imagePath.toggle_on : imagePath.toggle_off
                  }
                  style={styles.toggleImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <AppButton
                title="Apply Filter"
                onPress={handleApply}
                buttonStyle={styles.applyButton}
                linearColor={Colors.primary.APP_THEME}
                linearColorEnd={Colors.primary.APP_THEME}
                isLoading={filterLoading}
                disabled={isOptionsLoading || filterLoading}
              />
              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.resetText}>{translateText('reset')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    paddingTop: 20,
    maxHeight: '75%',
    paddingBottom: 12,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 22,
  },
  title: {
    color: Colors.primary.WHITE,
    fontSize: 20,
    fontFamily: fonts.Poppins_Medium,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  label: {
    color: Colors.primary.WHITE,
    fontSize: 14,
    marginTop: 18,
    fontFamily: fonts.Poppins_SemiBold,
    marginBottom: 6,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 6,
  },
  sliderTrackAge: {
    height: 6,
    borderRadius: 10,
  },
  selectedTrack: {
    backgroundColor: Colors.primary.APP_THEME,
  },
  unselectedTrack: {
    backgroundColor: '#666',
  },
  sliderMarker: {
    backgroundColor: Colors.primary.WHITE,
    borderWidth: 2,
    borderColor: Colors.primary.APP_THEME,
    height: 24,
    width: 24,
    marginTop: 5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#362B70',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 6,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.primary.APP_THEME,
  },
  chipText: {
    color: Colors.primary.WHITE,
    fontSize: 13,
    fontFamily: fonts.Poppins_Regular,
  },
  chipTextSelected: {
    color: Colors.primary.WHITE,
    fontFamily: fonts.Poppins_Regular,
  },
  toggleButton: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleImage: {
    width: 44,
    height: 24,
    alignSelf: 'center',
  },
  applyButton: {
    width: '100%',
    marginTop: 14,
  },
  resetText: {
    textAlign: 'center',
    color: Colors.primary.WHITE,
    fontFamily: fonts.Poppins_Regular,
    marginTop: 6,
    fontSize: 16,
  },
  sliderRangeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  rangeText: {
    color: Colors.primary.WHITE,
    fontSize: 12,
    fontFamily: fonts.Poppins_Regular,
    marginTop: 12,
  },
  customLabelContainer: {
    position: 'absolute',
    top: 40,
    backgroundColor: 'transparent',
  },
  sliderLabel: {
    color: Colors.primary.WHITE,
    fontSize: 12,
    fontFamily: fonts.Poppins_Regular,
  },
  bottomOverlay: {
    paddingHorizontal: 5,

    backgroundColor: Colors.primary.BLACK,
    borderRadius: 23,
    paddingBottom: 22,
    paddingVertical: 12,
  },
});
