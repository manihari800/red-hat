import React, { useState, useEffect } from "react";
import { Table, Form, Modal, Button, Dropdown, DropdownItem,} from "react-bootstrap";
import axios from "axios";

//Define interface for the Potion data structure
interface Potion {
  _id: string;
  name: string;
  effect: string;
  difficulty: string;
  characteristics: string;
  image: string;
  inventors: string;
  ingredients: string;
  side_effects: string;
  time: string;
  wiki: string;
}

// Define options for difficulty filter
const difficultyOptions = [
  { value: null, label: "All" },
  { value: "Beginner", label: "Beginner" },
  { value: "Beginner to Ordinary Wizarding Level", label: "Beginner to Ordinary Wizarding Level"},
  { value: "Advanced", label: "Advanced" },
  { value: "Beginner to Moderate", label: "Beginner to Moderate" },
  { value: "Moderate", label: "Moderate" },
  { value: "Ordinary Wizarding Level", label: "Ordinary Wizarding Level" },
  { value: "Moderate to advanced", label: "Moderate to advanced" },
];

// Define options for characteristics filters
const CharacteristicsOptions = [
    { value: null, label: "All" },
    { value: "Pink in colour", label: "Pink in colour" },
    { value: "Green in colour", label: "Green in colour"},
  ];

const PotionList: React.FC = () => {
    // State variables for managing potions, search, modal visibility, selected potion, current page, and filters
  const [potions, setPotions] = useState<Potion[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPotion, setSelectedPotion] = useState<Potion | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string | null >(null);
  const potionsPerPage = 10;

  useEffect(() => {
    // Fetch potions from the API using Axios
    axios
      .get("https://api.potterdb.com/v1/potions")
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          const potionData = response.data.data.map(
            (item: { id: string; attributes: Potion }) => ({
              _id: item.id,
              name: item.attributes.name,
              effect: item.attributes.effect,
              difficulty: item.attributes.difficulty,
              characteristics: item.attributes.characteristics,
              image: item.attributes.image,
              inventors: item.attributes.inventors,
              ingredients: item.attributes.ingredients,
              side_effects: item.attributes.side_effects,
              time: item.attributes.time,
              wiki: item.attributes.wiki,
            })
          );
          setPotions(potionData);
        } else {
          console.error("Invalid data structure. Expected an array.");
        }
      })
      .catch((error) => {
        console.error("Error fetching potions:", error);
      });
  }, []);

  useEffect(() => {
    setSearchTerm("");
  }, [currentPage]);

    // Show detailed information modal for a selected potion
  const handleShow = (potion: Potion) => {
    setSelectedPotion(potion);
    setShowModal(true);
  };

    // Close the detailed information modal
  const handleClose = () => {
    setShowModal(false);
  };

    // Handle changes in the difficulty filter
  const handleDifficultyChange = (difficulty: string | null) => {
    setSelectedDifficulty(difficulty || null);
  };

    // Handle changes in the characteristics filter
  const handleCharacteristicsChange = (characteristics: string | null) => {
    setSelectedCharacteristics(characteristics || null);
  };

    // Filter potions based on search term, difficulty, and characteristics
  const filteredPotions = potions.filter(
    (potion) =>
      potion &&
      potion.name &&
      potion.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedDifficulty ? potion.difficulty === selectedDifficulty : true) &&
      (selectedCharacteristics ? potion.characteristics === selectedCharacteristics : true)
  );
  const indexOfLastPotion = currentPage * potionsPerPage;
  const indexOfFirstPotion = indexOfLastPotion - potionsPerPage;
  const currentPotions = filteredPotions.slice(
    indexOfFirstPotion,
    indexOfLastPotion
  );

    // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredPotions.length / potionsPerPage);
 
  // Handle pagination - go to a specific page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Handle going to the previous page
  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

    // Handle going to the next page
  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div>
      <Form>
        <div className="row">
          {/* Search by name */}
          <div className="col-md-5 mb-4">
            <Form.Group controlId="formSearch">
              <Form.Control
                type="text"
                placeholder="Search by name"
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); 
                  }}
              />
            </Form.Group>
          </div>

          {/* Filter by Difficulty */}
          <div className="col-md-3 mb-1">
            <Form.Group
              controlId="formDifficulty"
              className="d-flex align-items-end"
            >
              <Form.Label className="mr-2">Filter by Difficulty:</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-difficulty">
                  {selectedDifficulty || "All"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {difficultyOptions.map((options) => (
                    <DropdownItem
                      key={options.value}
                      onClick={() => handleDifficultyChange(options.value)}
                    >
                      {options.label}
                    </DropdownItem>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </div>

          {/* Filter by Characteristics */}
          <div className="col-md-3 mb-1">
            <Form.Group
              controlId="formCharacteristics"
              className="d-flex align-items-end"
            >
              <Form.Label className="mr-2">
                Filter by Characteristics:
              </Form.Label>
              <Dropdown>
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-characteristics"
                >
                  {selectedCharacteristics || "All"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                 {CharacteristicsOptions.map((option)=>(
                    <DropdownItem key={option.value} onClick={()=>{handleCharacteristicsChange(option.value)}}>{option.label}</DropdownItem>
                 ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </div>
        </div>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Effect</th>
            <th>Difficulty</th>
            <th>Characteristic</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {currentPotions.map((potion) => (
            <tr
              key={potion._id}
              onClick={() => handleShow(potion)}
              style={{ cursor: "pointer" }}
            >
              <td>{potion.name || "Empty"}</td>
              <td>{potion.effect || "Empty"}</td>
              <td>{potion.difficulty || "Empty"}</td>
              <td>{potion.characteristics || "Empty"}</td>
              <td>
                <img
                  src={potion.image}
                  alt={potion.name}
                  style={{ maxWidth: "50px", maxHeight: "50px" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="pagination">
        <Button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </Button>
        {Array.from({ length: 3 }, (_, index) => {
          const pageNumber = currentPage + index; 
          return (
            <Button
              key={`page-${pageNumber}`}
              onClick={() => paginate(pageNumber)}
              disabled={pageNumber < 1 || pageNumber > totalPages}
              style={{
                background: pageNumber === currentPage ? "#73a4f2" : "#0d6efd",
              }}
            >
              {pageNumber}
            </Button>
          );
        })}
        <Button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      {/* Modal for detailed information */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedPotion?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-unstyled">
            <li>
              <strong>Effect:</strong>
              {selectedPotion?.effect || "Not specified"}
            </li>
            <li>
              <strong>Difficulty:</strong>
              {selectedPotion?.difficulty || "Not specified"}
            </li>
            <li>
              <strong>Characteristic:</strong>
              {selectedPotion?.characteristics || "Not specified"}
            </li>
            <li>
              <strong>Inventor:</strong>
              {selectedPotion?.inventors || "Not specified"}
            </li>
            <li>
              <strong>Ingredients:</strong>
              {selectedPotion?.ingredients || "Not specified"}
            </li>
            <li>
              <strong>Side Effects:</strong>
              {selectedPotion?.side_effects || "Not specified"}
            </li>
            <li>
              <strong>Time to Make:</strong>
              {selectedPotion?.time || "Not specified"}
            </li>
            <li>
              <strong>Wiki:</strong> {selectedPotion?.wiki || "Not specified"}
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PotionList;
