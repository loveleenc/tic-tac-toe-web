import scoreService from "../services/scoreService"
import { vi } from "vitest";
import liveDatabase from "../services/database/DatabaseLive";

const database = vi.fn(() => liveDatabase);

const mockGetAllScores = vi.spyOn(database(), 'getAllScores');
const mockAddWinToUserScore = vi.spyOn(database(), 'addWinToUserScore');
const mockAddLossToUserScore = vi.spyOn(database(), 'addLossToUserScore');
const mockAddTieToUserScore = vi.spyOn(database(), 'addTieToUserScore');

describe('scoreService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should call and return database().getAllScores()', async () => {
    const allScores = [{
      user: 'test',
      wins: 0,
      losses: 10,
      ties: 40
    }];
    mockGetAllScores.mockResolvedValue(allScores);
    const result = await scoreService.getScoreForAllUsers();
    expect(database().getAllScores).toHaveBeenCalled();
    expect(result).toEqual(allScores);
  });

  describe('addWinToUserScore', () => {
    it('should call addWinToUserScore if username is valid', async () => {
      await scoreService.addWinToUserScore('myUser');
      expect(mockAddWinToUserScore).toHaveBeenCalledWith('myUser');
    });

    it('should not call addWinToUserScore if username is null', async () => {
      await scoreService.addWinToUserScore(null);
      expect(mockAddWinToUserScore).not.toHaveBeenCalled();
    });

    it('should not call addWinToUserScore if username starts with Guest_', async () => {
      await scoreService.addWinToUserScore('Guest_123');
      expect(mockAddWinToUserScore).not.toHaveBeenCalled();
    });
  });

  describe('addLossToUserScore', () => {
    it('should call addLossToUserScore if username is valid', async () => {
      await scoreService.addLossToUserScore('myUser');
      expect(mockAddLossToUserScore).toHaveBeenCalledWith('myUser');
    });

    it('should not call addLossToUserScore if username is null', async () => {
      await scoreService.addLossToUserScore(null);
      expect(mockAddLossToUserScore).not.toHaveBeenCalled();
    });

    it('should not call addLossToUserScore if username starts with Guest_', async () => {
      await scoreService.addLossToUserScore('Guest_123');
      expect(mockAddLossToUserScore).not.toHaveBeenCalled();
    });
  });

  describe('addTieToUserScore', () => {
    it('should call addTieToUserScore if username is valid', async () => {
      await scoreService.addTieToUserScore('myUser');
      expect(mockAddTieToUserScore).toHaveBeenCalledWith('myUser');
    });

    it('should not call addTieToUserScore if username is null', async () => {
      await scoreService.addTieToUserScore(null);
      expect(mockAddTieToUserScore).not.toHaveBeenCalled();
    });

    it('should not call addTieToUserScore if username starts with Guest_', async () => {
      await scoreService.addTieToUserScore('Guest_123');
      expect(mockAddTieToUserScore).not.toHaveBeenCalled();
    });
  });
});