import { StyleSheet } from 'react-native';

const COLORS = {
  primary: '#1F3A93',
  primaryLight: '#3A5FBF',
  primaryGradient: ['#1F3A93', '#2E4DA2'],
  secondary: '#007ACC',
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

const styles = StyleSheet.create({
  /** General Layout **/
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 80, // Adjust based on header height
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTopContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#00416A',
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 18,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.borderLight,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.error,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  /** Weather Widget **/
  weatherWidget: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cardBg,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 6,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  weatherContent: {
    padding: 16,
  },
  mainWeatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  temperatureContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 54,
  },
  highLowContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  highLowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  highLowText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: 2,
    fontWeight: '500',
  },
  conditionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIconContainer: {
    backgroundColor: COLORS.cardBg,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weatherCondition: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  feelsLikeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  /** Modal **/
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalCloseButton: {
    padding: 6,
  },

  /** Loader **/
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  /** List & Empty State **/
  listContainer: {
    paddingBottom: 120,
    paddingHorizontal: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },

  /** Department Categories **/
  categoriesContainer: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  categoriesList: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    maxWidth: 64,
  },

  /** Post Container **/
  postContainer: {
    position: 'relative',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  departmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  departmentIcon: {
    marginRight: 8,
  },
  departmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    marginRight: 10,  
  },
  departmentTextContainer: {
    justifyContent: 'center',
  },
  departmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2
  },
  moreOptionsButton: {
    padding: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  
  postDate: {
    fontSize: 12,
    color: COLORS.subtext,
    marginLeft: 34,
    marginTop: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    paddingHorizontal: 2,
    lineHeight: 24,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 12,
    backgroundColor: COLORS.borderLight,
  },
  postContent: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 22,
  },

  /** Post Actions **/
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    
  },
  actionButtonActive: {
    backgroundColor: COLORS.borderLight,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop:4,
    fontWeight: '500',
  },
  actionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  postStats: {
    marginBottom: 8,
  },
  statsText: {
    fontSize: 13,
    color: COLORS.subtext,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 8,
  },
  activeActionText: {
    color: COLORS.secondary,
    fontWeight: '500',
  },

  /** Comment Modal **/
  commentModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    width: '100%',
    paddingTop: 20,
  },
  commentsList: {
    padding: 16,
  },
  commentItem: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryLight,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontWeight: '600',
    color: COLORS.text,
    fontSize: 15,
  },
  commentTime: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  commentMessage: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  commentInput: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    color: COLORS.text,
  },
  commentSubmitButton: {
    backgroundColor: COLORS.secondary,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  commentSubmitButtonDisabled: {
    backgroundColor: COLORS.borderLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  emptyComments: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyCommentsText: {
    marginTop: 16,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  
});

export default styles;        