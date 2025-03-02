import { StyleSheet } from 'react-native';

const COLORS = {
  primary: '#0062A8',
  primaryLight: '#4A89DC',
  primaryGradientStart: '#0062A8',
  primaryGradientEnd: '#0094FF',
  background: '#F5F7FA',
  cardBackground: '#FFFFFF',
  text: '#2C3E50',
  textLight: '#546E7A',
  subtext: '#7F8C8D',
  accent: '#00A8FF',
  white: '#FFFFFF',
  border: '#E4E8EC',
  borderLight: '#F0F2F5',
  error: '#E74C3C',
  success: '#2ECC71',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
  imageBackground: '#F2F6FF',
  profileGradientStart: '#0062A8',
  profileGradientEnd: '#0094FF',
};

const FONTS = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
  semiBold: 'Inter-SemiBold',
};

const SPACING = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

const BORDER_RADIUS = {
  tiny: 4,
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 24,
  circle: 100,
};

const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
};

const styles = StyleSheet.create({
  /** General Layout **/
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.large,
    paddingTop: SPACING.large + 10,
    paddingBottom: SPACING.large,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
    borderBottomLeftRadius: BORDER_RADIUS.large,
    borderBottomRightRadius: BORDER_RADIUS.large,
  },
  logoutIcon: {
    padding: SPACING.small + 2,
    borderRadius: 30,
    backgroundColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.medium,
    fontSize: 16,
    color: COLORS.textLight,
    fontFamily: FONTS.medium,
  },
  content: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.large,
    margin: SPACING.large,
    marginTop: SPACING.medium,
    ...SHADOWS.medium,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: SPACING.xlarge,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
    ...SHADOWS.medium,
    backgroundColor: COLORS.imageBackground,
  },
  imageLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
  },
  imageEditButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: COLORS.primary,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.small,
  },
  profileHeader: {
    alignItems: 'center',
    paddingBottom: SPACING.large,
    marginBottom: SPACING.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  profileName: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: SPACING.small,
    textAlign: 'center',
  },
  username: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    marginTop: SPACING.tiny,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.large,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
    minWidth: 100,
  },
  editButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  editButtonDisabled: {
    backgroundColor: 'rgba(0, 98, 168, 0.6)',
  },
  fieldContainer: {
    marginBottom: SPACING.large + 4,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.small,
    paddingLeft: SPACING.tiny,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },
  valueText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    flex: 1,
  },
  input: {
    backgroundColor: COLORS.borderLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: SPACING.small,
    paddingLeft: SPACING.tiny,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.large,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },
  dateText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  genderSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },
  genderText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.large,
    ...SHADOWS.large,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
  modalCloseButton: {
    marginTop: SPACING.large,
    backgroundColor: COLORS.borderLight,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  modalCloseButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  nonEditableField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 98, 168, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  sectionHeaderIcon: {
    marginRight: SPACING.small,
    backgroundColor: 'rgba(0, 98, 168, 0.1)',
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.small,
  },
  profileHeaderBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.primaryLight,
    borderBottomLeftRadius: BORDER_RADIUS.large,
    borderBottomRightRadius: BORDER_RADIUS.large,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: COLORS.borderLight,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: SPACING.small,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
    flex: 1,
    marginLeft: SPACING.small,
  },
  saveButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
});

export default styles;