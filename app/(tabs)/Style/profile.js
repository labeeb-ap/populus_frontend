import { StyleSheet } from 'react-native';

const COLORS = {
  primary: '#00538C',
  primaryLight: '#3A5FBF',
  background: '#F6F8FA',
  cardBackground: '#FFFFFF',
  text: '#2C3E50',
  textLight: '#546E7A',
  subtext: '#7F8C8D',
  accent: '#00A8FF',
  white: '#FFFFFF',
  border: '#E4E8EC',
  borderLight: '#F0F2F5',
  error: '#C0392B',
  success: '#27AE60',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
};

const FONTS = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
  semiBold: 'Inter-SemiBold',
};

const SPACING = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

const BORDER_RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 20,
};

const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
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
    paddingTop: SPACING.large,
    paddingBottom: SPACING.small,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  logoutIcon: {
    padding: SPACING.small,
    borderRadius: 30,
    backgroundColor: COLORS.borderLight,
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
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.large,
    margin: SPACING.large,
    ...SHADOWS.medium,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: SPACING.large,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.borderLight,
  },
  imageLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
  },
  imageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.small,
  },
  profileName: {
    fontSize: 22,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginTop: SPACING.small,
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
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  editButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  editButtonDisabled: {
    backgroundColor: '#99bedc',
  },
  fieldContainer: {
    marginBottom: SPACING.large,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.small,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.small,
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
    borderRadius: BORDER_RADIUS.small,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: SPACING.small,
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
    borderRadius: BORDER_RADIUS.small,
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
    borderRadius: BORDER_RADIUS.small,
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
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.large,
    ...SHADOWS.medium,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.medium,
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
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
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
    borderRadius: BORDER_RADIUS.small,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },
});

export default styles;