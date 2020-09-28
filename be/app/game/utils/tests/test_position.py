import unittest, pytest
from chess.piece import Position, PositionOutOfBounds

def run_tests(test_class):
    suite = unittest.TestLoader().loadTestsFromTestCase(test_class)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)


class TestPosition(unittest.TestCase):
    """Test suite for Position class"""

    def test_equals_method(self):
        """Test the __eq__ method for the position class"""
        self.assertTrue(Position(1, 1) == Position(1, 1))
        self.assertFalse(Position(1, 2) == Position(2, 1))
        self.assertTrue(Position(1, 1) == (1, 1))
        self.assertFalse(Position(1, 2) == (2, 1))

    def test_add_position_success(self):
        """Test the __add__ and __radd__ methods for position class"""
        position = Position(1, 1)
        other_position = Position(2, 2)
        self.assertEqual(Position(3, 3), position + other_position)
        self.assertEqual(Position(2, 2), position + (1, 1))
        self.assertEqual(Position(2, 2), (1, 1) + position)

    def test_add_position_invalid_type_fail(self):
        """Test adding position with invalid type fails"""
        pass

    def test_add_position_out_of_bounds(self):
        """Test if result of add is out of bounds exception is raised"""
        position = Position(0, 0)
        with pytest.raises(PositionOutOfBounds):
            result = position + (-1, 0)
        with pytest.raises(PositionOutOfBounds):
            result = position + Position(-1, 0)
        with pytest.raises(PositionOutOfBounds):
            result = position + (8, 0)
        with pytest.raises(PositionOutOfBounds):
            result = position + Position(8, 0)

    def test_iadd_position_success(self):
        """Test Position classes __iadd__ method"""
        position = Position(0, 0)
        position += (1, 1)
        self.assertEqual(Position(1, 1), position)
        position = Position(0, 0)
        position += Position(2, 2)
        self.assertEqual(Position(2, 2), position)

    def test_iadd_position_fail(self):
        """Test iadd fails with invalid type"""
        pass

    def test_iadd_raises_out_of_bounds_error(self):
        """Test iadd raises error when result is out of the boards bounds"""
        position = Position(0, 0)
        with pytest.raises(PositionOutOfBounds):
            position += (8, 0)
        self.assertEqual(position, Position(0, 0))

        with pytest.raises(PositionOutOfBounds):
            position += Position(8, 0)
        self.assertEqual(position, Position(0, 0))

        with pytest.raises(PositionOutOfBounds):
            position += (-1, 0)
        self.assertEqual(position, Position(0, 0))


if __name__ == "__main__":
    run_tests(TestPosition)